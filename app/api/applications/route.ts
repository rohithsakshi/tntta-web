import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { tournamentApplicationSchema } from "@/lib/validations"
import { PaymentStatus } from "@prisma/client"

export async function GET(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const tournamentId = searchParams.get("tournamentId")

  try {
    const applications = await prisma.tournamentApplication.findMany({
      where: {
        AND: [
          session.user.role === "ADMIN" ? {} : { playerId: session.user.id },
          tournamentId ? { tournamentId } : {}
        ]
      },
      include: {
        tournament: true,
        player: true
      },
      orderBy: { appliedAt: "desc" }
    })

    return NextResponse.json({ success: true, data: applications })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch applications" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validatedData = tournamentApplicationSchema.parse(body)

    // Check if already registered
    const existingApp = await prisma.tournamentApplication.findFirst({
      where: {
        tournamentId: validatedData.tournamentId,
        playerId: session.user.id,
        category: validatedData.category
      }
    })

    if (existingApp) {
      return NextResponse.json({ success: false, error: "You are already registered for this category" }, { status: 400 })
    }

    // Generate App ID
    const year = new Date().getFullYear()
    const count = await prisma.tournamentApplication.count()
    const appId = `APP-${year}-${(count + 1).toString().padStart(4, "0")}`

    const application = await prisma.tournamentApplication.create({
      data: {
        appId,
        tournamentId: validatedData.tournamentId,
        playerId: session.user.id,
        category: validatedData.category,
        amount: validatedData.amount,
        paymentStatus: PaymentStatus.PENDING
      }
    })

    return NextResponse.json({ success: true, data: application })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}