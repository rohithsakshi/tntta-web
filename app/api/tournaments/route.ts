import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import { tournamentSchema } from "@/lib/validations"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const limit = searchParams.get("limit")

  try {
    const tournaments = await prisma.tournament.findMany({
      where: status ? { status: status as any } : {},
      take: limit ? parseInt(limit) : undefined,
      orderBy: { startDate: "asc" },
    })

    return NextResponse.json({ success: true, data: tournaments })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch tournaments" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validatedData = tournamentSchema.parse(body)
    
    const slug = validatedData.title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "")

    const tournament = await prisma.tournament.create({
      data: {
        ...validatedData,
        slug,
        createdById: session.user.id,
      }
    })

    return NextResponse.json({ success: true, data: tournament })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}