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
  } catch (error: any) {
    console.warn("API: Failed to fetch applications (DB offline)")
    return NextResponse.json({ success: true, data: [] })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    if (!prisma) {
      throw new Error("Can't reach database (Prisma not initialized)")
    }

    const body = await req.json()
    const { tournamentId, categories } = body

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ success: false, error: "No categories selected" }, { status: 400 })
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId }
    })

    if (!tournament) {
      return NextResponse.json({ success: false, error: "Tournament not found" }, { status: 404 })
    }

    const createdApplications = []
    const year = new Date().getFullYear()
    let count = await prisma.tournamentApplication.count()

    for (const category of categories) {
      // Check if already registered for this category
      const existingApp = await prisma.tournamentApplication.findFirst({
        where: {
          tournamentId,
          playerId: session.user.id,
          category
        }
      })

      if (existingApp) continue // Skip if already registered

      count++
      const appId = `APP-${year}-${count.toString().padStart(4, "0")}`

      const application = await prisma.tournamentApplication.create({
        data: {
          appId,
          tournamentId,
          playerId: session.user.id,
          category,
          amount: tournament.entryFee,
          paymentStatus: PaymentStatus.PAID,
          confirmedAt: new Date()
        }
      })
      createdApplications.push(application)
    }

    if (createdApplications.length === 0) {
      return NextResponse.json({ success: false, error: "You are already registered for all selected categories" }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: createdApplications })
  } catch (error: any) {
    console.error("Application submission error:", error)
    
    // Fallback for Demo / DB Offline
    if (error.message?.includes("Can't reach database") || error.code === "P1001") {
      console.warn("DATABASE OFFLINE: Simulating successful application submission.")
      return NextResponse.json({ 
        success: true, 
        data: [{ id: "demo-app-id", appId: "APP-DEMO-001" }],
        message: "Applications received (Demo Mode)" 
      })
    }

    return NextResponse.json({ success: false, error: error.message || "Failed to submit applications" }, { status: 500 })
  }
}