import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { MatchSlot } from "@/models";
import { pusher } from "@/lib/pusher";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { matchId } = await params;
  const { player1Present, player2Present } = await req.json();

  try {
    await connectToDatabase();
    
    const match = await MatchSlot.findByIdAndUpdate(
      matchId,
      {
        player1Present,
        player2Present,
      },
      { new: true }
    );

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    await pusher.trigger(`tournament-${match.tournamentId}-fixtures`, "table.updated", {
      tableNumber: match.tableNumber,
      player1Present,
      player2Present,
    });

    return NextResponse.json({ success: true, match });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update attendance" }, { status: 500 });
  }
}
