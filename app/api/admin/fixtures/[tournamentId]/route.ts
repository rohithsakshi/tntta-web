import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { MatchSlot, TournamentBracket, TableStatus, MatchStatus } from "@/models";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tournamentId: string }> }
) {
  const { tournamentId } = await params;
  const { searchParams } = new URL(req.url);
  const table = searchParams.get("table");
  const category = searchParams.get("category");

  try {
    await connectToDatabase();
    
    const query: any = { tournamentId };
    if (table) query.tableNumber = parseInt(table);
    if (category) query.category = category;

    const fixtures = await MatchSlot.find(query)
      .sort({ scheduledStartTime: 1 })
      .populate("player1Id")
      .populate("player2Id")
      .lean();

    const normalizedFixtures = fixtures.map((f: any) => ({
      ...f,
      id: f._id.toString(),
      player1: f.player1Id,
      player2: f.player2Id
    }));

    return NextResponse.json(normalizedFixtures);
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
    await connectToDatabase();
    
    // Clear all related collections
    await MatchSlot.deleteMany({ tournamentId });
    // await TeamMatch.deleteMany({ tournamentId });
    await TournamentBracket.deleteMany({ tournamentId });
    await TableStatus.deleteMany({ tournamentId });

    return NextResponse.json({ success: true, message: "All fixtures deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete fixtures" }, { status: 500 });
  }
}
