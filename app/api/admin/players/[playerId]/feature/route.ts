import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  const { playerId } = await params;
  const { isFeatured } = await req.json();

  try {
    const player = await prisma.user.update({
      where: { id: playerId },
      data: { isFeatured },
    });

    return NextResponse.json({ success: true, player });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update featured status" }, { status: 500 });
  }
}
