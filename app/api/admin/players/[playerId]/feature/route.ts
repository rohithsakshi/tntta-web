import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  const { playerId } = await params;
  const { isFeatured } = await req.json();

  try {
    await connectToDatabase();
    
    const player = await User.findByIdAndUpdate(
      playerId,
      { isFeatured },
      { new: true }
    );

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, player });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update featured status" }, { status: 500 });
  }
}
