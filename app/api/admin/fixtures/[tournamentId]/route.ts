import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MatchStatus } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tournamentId: string }> }
) {
  const { tournamentId } = await params;
  const { searchParams } = new URL(req.url);
  const table = searchParams.get("table");
  const category = searchParams.get("category");

  try {
    const fixtures = await prisma.matchSlot.findMany({
      where: {
        tournamentId,
        ...(table ? { tableNumber: parseInt(table) } : {}),
        ...(category ? { category } : {}),
      },
      orderBy: { scheduledStartTime: "asc" },
      include: {
        player1: true,
        player2: true,
      },
    });

    return NextResponse.json(fixtures);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch fixtures" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tournamentId: string }> }
) {
  const { tournamentId } = await params;

  try {
    await prisma.$transaction([
      prisma.matchSlot.deleteMany({ where: { tournamentId } }),
      prisma.teamMatch.deleteMany({ where: { tournamentId } }),
      prisma.tournamentBracket.deleteMany({ where: { tournamentId } }),
      prisma.tableStatus.deleteMany({ where: { tournamentId } }),
    ]);

    return NextResponse.json({ success: true, message: "All fixtures deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete fixtures" }, { status: 500 });
  }
}
