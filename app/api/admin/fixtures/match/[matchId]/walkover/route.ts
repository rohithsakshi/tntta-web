import { NextRequest, NextResponse } from "next/server";
import { handleWalkover, advanceTable } from "@/lib/fixtures/reshuffler";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { matchId } = await params;
  const { absentPlayerId, reason } = await req.json();

  try {
    const match = await handleWalkover(matchId, absentPlayerId, reason);
    await advanceTable(match.tournamentId, match.tableNumber);

    return NextResponse.json({ success: true, match });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to confirm walkover" }, { status: 500 });
  }
}
