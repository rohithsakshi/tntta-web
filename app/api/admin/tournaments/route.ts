import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { UserRole, TournamentStatus } from "@prisma/client"
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
    console.info("Tournament creation attempt:", { title: body.title, userId: session.user.id })
    
    const validatedData = tournamentSchema.parse(body)

    let createdById = session.user.id

    // Fallback if session is stale and contains mock ID
    if (createdById === "admin-readme") {
      const realAdmin = await prisma.user.findUnique({
        where: { contact: "9999999999" }
      })
      if (realAdmin) {
        createdById = realAdmin.id
        console.info("Corrected stale session ID to real admin ID:", createdById)
      } else {
        return NextResponse.json({ error: "Admin user not found in database. Please run seeding." }, { status: 500 })
      }
    }

    const slug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const tournament = await prisma.tournament.create({
      data: {
        ...validatedData,
        slug,
        createdById,
      },
    })

    return NextResponse.json(tournament, { status: 201 })
  } catch (error: any) {
    console.error("Tournament creation error DETAILS:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error.message || String(error)
    }, { status: 500 })
  }
}
