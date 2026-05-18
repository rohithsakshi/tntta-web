import connectToDatabase from "@/lib/mongodb";
import { MatchSlot, MatchStatus } from "@/models";
import { pusher } from "@/lib/pusher";

export async function handleWalkover(matchId: string, absentPlayerId: string, reason: string) {
  await connectToDatabase();
  
  // 1. Fetch match details
  const match = await MatchSlot.findById(matchId).populate("player1").populate("player2");

  if (!match) throw new Error("Match not found");

  const winnerId = match.player1Id.toString() === absentPlayerId ? match.player2Id : match.player1Id;

  if (!winnerId) throw new Error("Cannot determine winner for walkover");

  // 2. Update current match
  const updatedMatch = await MatchSlot.findByIdAndUpdate(
    matchId,
    {
      status: MatchStatus.WALKOVER,
      winnerId,
      actualEndTime: new Date(),
    },
    { new: true }
  );

  // 3. Disqualification Consequences
  // Find ALL remaining MatchSlots for absentPlayerId in this tournament
  const remainingMatches = await MatchSlot.find({
    tournamentId: match.tournamentId,
    $or: [
      { player1Id: absentPlayerId },
      { player2Id: absentPlayerId }
    ],
    status: { $in: [MatchStatus.SCHEDULED, MatchStatus.CALLING] },
    _id: { $ne: matchId }
  });

  for (const m of remainingMatches) {
    const otherPlayerId = m.player1Id.toString() === absentPlayerId ? m.player2Id : m.player1Id;
    await MatchSlot.findByIdAndUpdate(m.id, {
      status: MatchStatus.WALKOVER,
      winnerId: otherPlayerId,
      actualEndTime: new Date(),
    });
  }

  // 4. Trigger Pusher
  await pusher.trigger(`tournament-${match.tournamentId}-fixtures`, "match.walkover", {
    matchId,
    tableNumber: match.tableNumber,
    absentPlayerId,
    winnerId,
  });

  return updatedMatch;
}

export async function advanceTable(tournamentId: string, tableNumber: number) {
  await connectToDatabase();
  
  // Find next SCHEDULED match for this table
  const nextMatch = await MatchSlot.findOne({
    tournamentId,
    tableNumber,
    status: MatchStatus.SCHEDULED,
  }).sort({ scheduledStartTime: 1 });

  if (nextMatch) {
    // Move its scheduledStartTime to now() + 2 min buffer
    const newStart = new Date(Date.now() + 2 * 60 * 1000);
    await MatchSlot.findByIdAndUpdate(nextMatch.id, {
      scheduledStartTime: newStart,
      status: MatchStatus.CALLING,
      noShowGraceUntil: new Date(newStart.getTime() + 5 * 60 * 1000),
    });

    await pusher.trigger(`tournament-${tournamentId}-fixtures`, "match.calling", {
      matchId: nextMatch.id,
      tableNumber,
    });
  }
}
