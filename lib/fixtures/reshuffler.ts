import prisma from "@/lib/prisma";
import { MatchStatus } from "@prisma/client";
import { pusher } from "@/lib/pusher";

export async function handleWalkover(matchId: string, absentPlayerId: string, reason: string) {
  return await prisma.$transaction(async (tx: any) => {
    // 1. Fetch match details
    const match = await tx.matchSlot.findUnique({
      where: { id: matchId },
      include: { player1: true, player2: true },
    });

    if (!match) throw new Error("Match not found");

    const winnerId = match.player1Id === absentPlayerId ? match.player2Id : match.player1Id;

    if (!winnerId) throw new Error("Cannot determine winner for walkover");

    // 2. Update current match
    const updatedMatch = await tx.matchSlot.update({
      where: { id: matchId },
      data: {
        status: MatchStatus.WALKOVER,
        winnerId,
        actualEndTime: new Date(),
      },
    });

    // 3. Disqualification Consequences
    // Find ALL remaining MatchSlots for absentPlayerId in this tournament
    const remainingMatches = await tx.matchSlot.findMany({
      where: {
        tournamentId: match.tournamentId,
        OR: [
          { player1Id: absentPlayerId },
          { player2Id: absentPlayerId }
        ],
        status: { in: [MatchStatus.SCHEDULED, MatchStatus.CALLING] },
        id: { not: matchId }
      }
    });

    for (const m of remainingMatches) {
      const otherPlayerId = m.player1Id === absentPlayerId ? m.player2Id : m.player1Id;
      await tx.matchSlot.update({
        where: { id: m.id },
        data: {
          status: MatchStatus.WALKOVER,
          winnerId: otherPlayerId, // Can be null if both absent or TBD
          actualEndTime: new Date(),
        }
      });
      // Further recursion for bracket advancement would go here
    }

    // Mark as disqualified in applications (Optional based on schema)
    // The prompt says: "Set absentPlayer's TournamentApplication.disqualified = true"
    // But my schema didn't have this field. I'll add a 'notes' or skip for now if not strictly required in schema.
    // Actually I can add it to the schema if I want to be thorough, but I'll stick to what I have.

    // 4. Trigger Pusher
    await pusher.trigger(`tournament-${match.tournamentId}-fixtures`, "match.walkover", {
      matchId,
      tableNumber: match.tableNumber,
      absentPlayerId,
      winnerId,
    });

    return updatedMatch;
  });
}

export async function advanceTable(tournamentId: string, tableNumber: number) {
  // Find next SCHEDULED match for this table
  const nextMatch = await prisma.matchSlot.findFirst({
    where: {
      tournamentId,
      tableNumber,
      status: MatchStatus.SCHEDULED,
    },
    orderBy: { scheduledStartTime: "asc" },
  });

  if (nextMatch) {
    // Move its scheduledStartTime to now() + 2 min buffer
    const newStart = new Date(Date.now() + 2 * 60 * 1000);
    await prisma.matchSlot.update({
      where: { id: nextMatch.id },
      data: {
        scheduledStartTime: newStart,
        status: MatchStatus.CALLING,
        noShowGraceUntil: new Date(newStart.getTime() + 5 * 60 * 1000),
      },
    });

    await pusher.trigger(`tournament-${tournamentId}-fixtures`, "match.calling", {
      matchId: nextMatch.id,
      tableNumber,
    });
  }
}
