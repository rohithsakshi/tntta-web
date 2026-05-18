import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { MatchSlot, MatchStatus } from "@/models";
import { pusher } from "@/lib/pusher";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { matchId } = await params;
  const { estimatedExtraMinutes } = await req.json();

  try {
    await connectToDatabase();
    
    const match = await MatchSlot.findById(matchId);
    if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });

    // Update current match
    await MatchSlot.findByIdAndUpdate(matchId, {
      status: MatchStatus.DELAYED,
      $inc: { delayMinutes: estimatedExtraMinutes },
    });

    await pusher.trigger(`tournament-${match.tournamentId}-fixtures`, "match.delayed", {
      tableNumber: match.tableNumber,
      delayMinutes: estimatedExtraMinutes,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delay match" }, { status: 500 });
  }
}
