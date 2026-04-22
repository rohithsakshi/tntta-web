import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { UserRole, TournamentStatus, TournamentType, Category } from "@prisma/client"
import { z } from "zod"

const tournamentSchema = z.object({
  title: z.string().min(3),
  type: z.nativeEnum(TournamentType),
  description: z.string().min(10),
  venue: z.string().min(5),
  location: z.string().min(3),
  startDate: z.string(),
  endDate: z.string(),
  registrationOpens: z.string(),
  registrationDeadline: z.string(),
  entryFee: z.number().min(0),
  maxParticipants: z.number().optional(),
  categories: z.array(z.nativeEnum(Category)),
  status: z.nativeEnum(TournamentStatus).default(TournamentStatus.DRAFT),
})

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
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        registrationOpens: new Date(validatedData.registrationOpens),
        registrationDeadline: new Date(validatedData.registrationDeadline),
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
