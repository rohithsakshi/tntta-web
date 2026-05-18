import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { MatchResult, User, UserRole } from "@/models"
import { auth } from "@/lib/auth"
import { matchResultSchema } from "@/lib/validations"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tournamentId = searchParams.get("tournamentId")
  const category = searchParams.get("category")

  try {
    await connectToDatabase()
    
    const query: any = {};
    if (tournamentId) query.tournamentId = tournamentId;
    if (category) query.category = category;

    const results = await MatchResult.find(query)
      .populate("player1Id")
      .populate("player2Id")
      .populate("tournamentId")
      .sort({ playedAt: -1 })
      .lean();

    const normalizedResults = results.map((r: any) => ({
      ...r,
      id: r._id.toString(),
      player1: r.player1Id,
      player2: r.player2Id,
      tournament: r.tournamentId
    }));

    return NextResponse.json({ success: true, data: normalizedResults })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch results" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectToDatabase()
    const body = await req.json()
    const validatedData = matchResultSchema.parse(body)

    const result = await MatchResult.create({
      tournamentId: validatedData.tournamentId,
      player1Id: validatedData.player1Id,
      player2Id: validatedData.player2Id,
      score: validatedData.score,
      winnerId: validatedData.winnerId,
      round: validatedData.round,
      category: validatedData.category
    })

    // Update winner's ranking points
    await User.findByIdAndUpdate(validatedData.winnerId, {
      $inc: { rankingPoints: 10 }
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
