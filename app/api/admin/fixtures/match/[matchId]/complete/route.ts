import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { 
  MatchSlot, 
  MatchResult, 
  User, 
  TableStatus, 
  MatchStatus, 
  TableStatusEnum 
} from "@/models";
import { pusher } from "@/lib/pusher";
import { advanceTable } from "@/lib/fixtures/reshuffler";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { matchId } = await params;
  const { score, winnerId } = await req.json();

  try {
    await connectToDatabase();
    
    const match = await MatchSlot.findById(matchId);

    if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });

    // 1. Update Match Slot
    const updatedMatch = await MatchSlot.findByIdAndUpdate(
      matchId,
      {
        status: MatchStatus.COMPLETED,
        score,
        winnerId,
        actualEndTime: new Date(),
      },
      { new: true }
    );

    // 2. Save Match Result (historical record)
    await MatchResult.create({
      tournamentId: match.tournamentId,
      player1Id: match.player1Id,
      player2Id: match.player2Id,
      winnerId,
      score,
      round: match.round,
      category: match.category,
    });

    // 3. Assign Ranking Points (Winner +10, Loser +5 - Simplified)
    await User.findByIdAndUpdate(winnerId, { $inc: { rankingPoints: 10 } });
    
    const loserId = match.player1Id.toString() === winnerId ? match.player2Id : match.player1Id;
    if (loserId) {
      await User.findByIdAndUpdate(loserId, { $inc: { rankingPoints: 5 } });
    }

    // 4. Update Table Status
    await TableStatus.findOneAndUpdate(
      { tournamentId: match.tournamentId, tableNumber: match.tableNumber },
      {
        status: TableStatusEnum.IDLE,
        currentMatchId: null,
      }
    );

    // 5. Advance winner in bracket
    const nextRound = match.roundNumber + 1;
    const nextPosition = Math.floor(match.position / 2);
    const isPlayer1Slot = match.position % 2 === 0;

    const nextMatch = await MatchSlot.findOne({
      tournamentId: match.tournamentId,
      category: match.category,
      eventType: match.eventType,
      roundNumber: nextRound,
      position: nextPosition,
    });

    if (nextMatch) {
      const updateField = isPlayer1Slot ? 'player1Id' : 'player2Id';
      await MatchSlot.findByIdAndUpdate(nextMatch.id, {
        [updateField]: winnerId,
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
    await advanceTable(match.tournamentId.toString(), match.tableNumber);

    return NextResponse.json({ success: true, match: updatedMatch });

  } catch (error: any) {
    console.error("Match Completion Error:", error);
    return NextResponse.json({ error: error.message || "Failed to complete match" }, { status: 500 });
  }
}
