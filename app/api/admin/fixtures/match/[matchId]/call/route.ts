import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { MatchSlot, MatchStatus } from "@/models";
import { pusher } from "@/lib/pusher";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { matchId } = await params;

  try {
    await connectToDatabase();
    
    const match = await MatchSlot.findByIdAndUpdate(
      matchId,
      {
        status: MatchStatus.CALLING,
        noShowGraceUntil: new Date(Date.now() + 5 * 60 * 1000), // 5 min grace
      },
      { new: true }
    ).populate("player1Id").populate("player2Id");

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    await pusher.trigger(`tournament-${match.tournamentId}-fixtures`, "match.calling", {
      matchId,
      tableNumber: match.tableNumber,
      player1: match.player1Id,
      player2: match.player2Id,
    });

    return NextResponse.json({ success: true, match });
  } catch (error) {
    return NextResponse.json({ error: "Failed to call players" }, { status: 500 });
  }
}
