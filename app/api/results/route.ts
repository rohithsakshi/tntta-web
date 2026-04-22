import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { matchResultSchema } from "@/lib/validations"
import { UserRole } from "@prisma/client"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tournamentId = searchParams.get("tournamentId")
  const category = searchParams.get("category")

  try {
    const results = await prisma.matchResult.findMany({
      where: {
        AND: [
          tournamentId ? { tournamentId } : {},
          category ? { category } : {}
        ]
      },
      include: {
        player1: true,
        player2: true,
        tournament: true
      },
      orderBy: { playedAt: "desc" }
    })

    return NextResponse.json({ success: true, data: results })
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
    const body = await req.json()
    const validatedData = matchResultSchema.parse(body)

    const result = await prisma.matchResult.create({
      data: {
        tournamentId: validatedData.tournamentId,
        player1Id: validatedData.player1Id,
        player2Id: validatedData.player2Id,
        score: validatedData.score,
        winnerId: validatedData.winnerId,
        round: validatedData.round,
        category: validatedData.category
      }
    })

    // Update winner's ranking points
    await prisma.user.update({
      where: { id: validatedData.winnerId },
      data: {
        rankingPoints: { increment: 10 } // Winner gets 10 points for now
      }
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
