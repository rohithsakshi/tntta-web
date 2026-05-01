import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MatchStatus, TableStatusEnum } from "@prisma/client";
import { pusher } from "@/lib/pusher";
import { advanceTable } from "@/lib/fixtures/reshuffler";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { matchId } = await params;
  const { score, winnerId } = await req.json();

  try {
    const match = await prisma.matchSlot.findUnique({
      where: { id: matchId },
    });

    if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });

    const updatedMatch = await prisma.$transaction(async (tx: any) => {
      // 1. Update Match Slot
      const m = await tx.matchSlot.update({
        where: { id: matchId },
        data: {
          status: MatchStatus.COMPLETED,
          score,
          winnerId,
          actualEndTime: new Date(),
        },
      });

      // 2. Save Match Result (historical record)
      await tx.matchResult.create({
        data: {
          tournamentId: match.tournamentId,
          player1Id: match.player1Id!,
          player2Id: match.player2Id!,
          winnerId,
          score,
          round: match.round,
          category: match.category,
        }
      });

      // 3. Assign Ranking Points (Winner +10, Loser +7 SF, etc - Simplified)
      // Winner points
      await tx.user.update({
        where: { id: winnerId },
        data: { rankingPoints: { increment: 10 } },
      });
      // Loser points
      const loserId = match.player1Id === winnerId ? match.player2Id : match.player1Id;
      if (loserId) {
        await tx.user.update({
          where: { id: loserId },
          data: { rankingPoints: { increment: 5 } },
        });
      }

      // 4. Update Table Status
      await tx.tableStatus.update({
        where: {
          tournamentId_tableNumber: {
            tournamentId: match.tournamentId,
            tableNumber: match.tableNumber,
          }
        },
        data: {
          status: TableStatusEnum.IDLE,
          currentMatchId: null, // Next match will be assigned by advanceTable
        },
      });

      return m;
    });

    // 5. Advance winner in bracket
    const nextRound = match.roundNumber + 1;
    const nextPosition = Math.floor(match.position / 2);
    const isPlayer1Slot = match.position % 2 === 0;

    const nextMatch = await prisma.matchSlot.findFirst({
      where: {
        tournamentId: match.tournamentId,
        category: match.category,
        eventType: match.eventType,
        roundNumber: nextRound,
        position: nextPosition,
      }
    });

    if (nextMatch) {
      await prisma.matchSlot.update({
        where: { id: nextMatch.id },
        data: {
          [isPlayer1Slot ? 'player1Id' : 'player2Id']: winnerId,
        }
      });
    }

    // 6. Trigger Pusher
    await Promise.all([
      pusher.trigger(`tournament-${match.tournamentId}-fixtures`, "match.completed", {
        matchId,
        winnerId,
        score,
        tableNumber: match.tableNumber,
      }),
      pusher.trigger(`tournament-${match.tournamentId}-fixtures`, "table.updated", {
        tableNumber: match.tableNumber,
        status: TableStatusEnum.IDLE,
        currentMatchId: null,
      }),
    ]);

    // 7. Advance table
    await advanceTable(match.tournamentId, match.tableNumber);

    return NextResponse.json({ success: true, match: updatedMatch });

  } catch (error: any) {
    console.error("Match Completion Error:", error);
    return NextResponse.json({ error: error.message || "Failed to complete match" }, { status: 500 });
  }
}
