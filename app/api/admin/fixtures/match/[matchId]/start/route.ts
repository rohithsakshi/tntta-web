import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MatchStatus, TableStatusEnum } from "@prisma/client";
import { pusher } from "@/lib/pusher";

export async function POST(
  req: NextRequest,
  { params }: { params: { matchId: string } }
) {
  const { matchId } = params;

  try {
    const match = await prisma.matchSlot.findUnique({
      where: { id: matchId },
    });

    if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });
    if (!match.player1Present || !match.player2Present) {
      return NextResponse.json({ error: "Cannot start — player not confirmed present" }, { status: 400 });
    }

    const updatedMatch = await prisma.$transaction([
      prisma.matchSlot.update({
        where: { id: matchId },
        data: {
          actualStartTime: new Date(),
          status: MatchStatus.IN_PROGRESS,
        },
      }),
      prisma.tableStatus.update({
        where: {
          tournamentId_tableNumber: {
            tournamentId: match.tournamentId,
            tableNumber: match.tableNumber,
          }
        },
        data: { status: TableStatusEnum.IN_USE },
      }),
    ]);

    await pusher.trigger(`tournament-${match.tournamentId}-fixtures`, "match.started", {
      matchId,
      tableNumber: match.tableNumber,
      startTime: new Date(),
    });

    return NextResponse.json({ success: true, match: updatedMatch[0] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to start match" }, { status: 500 });
  }
}
