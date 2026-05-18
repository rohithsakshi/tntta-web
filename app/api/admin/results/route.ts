import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { MatchResult, UserRole } from "@/models"
import { auth } from "@/lib/auth"
import { z } from "zod"

const matchResultSchema = z.object({
  tournamentId: z.string(),
  player1Id: z.string(),
  player2Id: z.string(),
  winnerId: z.string(),
  score: z.string(),
  round: z.string(),
  category: z.string(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectToDatabase()
    const body = await req.json()
    const validatedData = matchResultSchema.parse(body)

    const matchResult = await MatchResult.create(validatedData)

    return NextResponse.json(matchResult, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("Match result creation error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
