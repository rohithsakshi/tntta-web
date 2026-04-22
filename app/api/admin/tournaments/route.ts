import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { UserRole, TournamentStatus, TournamentType, Category } from "@prisma/client"
import { z } from "zod"
import { tournamentSchema } from "@/lib/validations"

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(tournaments)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tournaments" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validatedData = tournamentSchema.parse(body)

    const slug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const tournament = await prisma.tournament.create({
      data: {
        ...validatedData,
        slug,
        createdById: session.user.id,
      },
    })

    return NextResponse.json(tournament, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("Tournament creation error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
