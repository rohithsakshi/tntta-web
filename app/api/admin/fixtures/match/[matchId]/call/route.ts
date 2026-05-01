import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MatchStatus } from "@prisma/client";
import { pusher } from "@/lib/pusher";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { matchId } = await params;

  try {
    const match = await prisma.matchSlot.update({
      where: { id: matchId },
      data: {
        status: MatchStatus.CALLING,
        noShowGraceUntil: new Date(Date.now() + 5 * 60 * 1000), // 5 min grace
      },
      include: { player1: true, player2: true },
    });

    await pusher.trigger(`tournament-${match.tournamentId}-fixtures`, "match.calling", {
      matchId,
      tableNumber: match.tableNumber,
      player1: match.player1,
      player2: match.player2,
    });

    return NextResponse.json({ success: true, match });
  } catch (error) {
    return NextResponse.json({ error: "Failed to call players" }, { status: 500 });
  }
}
