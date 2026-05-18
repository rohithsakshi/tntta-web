import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { MatchSlot, TableStatus, MatchStatus, TableStatusEnum } from "@/models";
import { pusher } from "@/lib/pusher";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { matchId } = await params;

  try {
    await connectToDatabase();
    
    const match = await MatchSlot.findById(matchId);

    if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });
    if (!match.player1Present || !match.player2Present) {
      return NextResponse.json({ error: "Cannot start — player not confirmed present" }, { status: 400 });
    }

    // 1. Update Match Slot
    const updatedMatch = await MatchSlot.findByIdAndUpdate(
      matchId,
      {
        actualStartTime: new Date(),
        status: MatchStatus.IN_PROGRESS,
      },
      { new: true }
    );

    // 2. Update Table Status
    await TableStatus.findOneAndUpdate(
      { tournamentId: match.tournamentId, tableNumber: match.tableNumber },
      { status: TableStatusEnum.IN_USE }
    );

    await pusher.trigger(`tournament-${match.tournamentId}-fixtures`, "match.started", {
      matchId,
      tableNumber: match.tableNumber,
      startTime: new Date(),
    });

    return NextResponse.json({ success: true, match: updatedMatch });
  } catch (error) {
    return NextResponse.json({ error: "Failed to start match" }, { status: 500 });
  }
}
