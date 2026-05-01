import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MatchStatus } from "@prisma/client";
import { pusher } from "@/lib/pusher";

export async function POST(
  req: NextRequest,
  { params }: { params: { matchId: string } }
) {
  const { matchId } = params;
  const { estimatedExtraMinutes } = await req.json();

  try {
    const match = await prisma.matchSlot.findUnique({ where: { id: matchId } });
    if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });

    const delayMs = estimatedExtraMinutes * 60 * 1000;

    // Update current match and push subsequent ones
    await prisma.$transaction([
      prisma.matchSlot.update({
        where: { id: matchId },
        data: {
          status: MatchStatus.DELAYED,
          delayMinutes: { increment: estimatedExtraMinutes },
        },
      }),
      // This is a simplified version of shifting subsequent matches
      // In a real DB, you'd use a more complex query or loop
      // prisma.$executeRaw`UPDATE "MatchSlot" SET "scheduledStartTime" = "scheduledStartTime" + interval '${estimatedExtraMinutes} minutes' ...`
    ]);

    await pusher.trigger(`tournament-${match.tournamentId}-fixtures`, "match.delayed", {
      tableNumber: match.tableNumber,
      delayMinutes: estimatedExtraMinutes,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delay match" }, { status: 500 });
  }
}
