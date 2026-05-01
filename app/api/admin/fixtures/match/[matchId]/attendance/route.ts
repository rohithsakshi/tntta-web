import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { matchId } = await params;
  const { player1Present, player2Present } = await req.json();

  try {
    const match = await prisma.matchSlot.update({
      where: { id: matchId },
      data: {
        player1Present,
        player2Present,
      },
    });

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
