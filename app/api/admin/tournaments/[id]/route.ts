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
  status: z.nativeEnum(TournamentStatus),
})

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    })
    if (!tournament) return NextResponse.json({ error: "Not Found" }, { status: 404 })
    return NextResponse.json(tournament)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await req.json()
    const validatedData = tournamentSchema.parse(body)

    const tournament = await prisma.tournament.update({
      where: { id },
      data: {
        ...validatedData,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        registrationOpens: new Date(validatedData.registrationOpens),
        registrationDeadline: new Date(validatedData.registrationDeadline),
      },
    })

    return NextResponse.json(tournament)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("Tournament update error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    // Check if entries exist
    const entriesCount = await prisma.tournamentApplication.count({
      where: { tournamentId: id }
    })

    if (entriesCount > 0) {
      return NextResponse.json({ error: "Cannot delete tournament with registered players" }, { status: 400 })
    }

    await prisma.tournament.delete({ where: { id } })
    return NextResponse.json({ message: "Deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
