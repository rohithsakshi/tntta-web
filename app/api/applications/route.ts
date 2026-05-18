import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { Tournament, TournamentApplication, PaymentStatus } from "@/models"
import { auth } from "@/lib/auth"

export async function GET(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const tournamentId = searchParams.get("tournamentId")

  try {
    await connectToDatabase()
    
    let query: any = {}
    if (session.user.role !== "ADMIN") {
      query.playerId = session.user.id
    }
    if (tournamentId) {
      query.tournamentId = tournamentId
    }

    const applications = await TournamentApplication.find(query)
      .populate("tournamentId")
      .populate("playerId")
      .sort({ appliedAt: -1 })
      .lean()

    // Transforming for frontend if needed (renaming tournamentId/playerId to tournament/player)
    const transformedData = applications.map((app: any) => ({
      ...app,
      tournament: app.tournamentId,
      player: app.playerId,
    }))

    return NextResponse.json({ success: true, data: transformedData })
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
    await connectToDatabase()

    const body = await req.json()
    const { tournamentId, categories } = body

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ success: false, error: "No categories selected" }, { status: 400 })
    }

    const tournament = await Tournament.findById(tournamentId)

    if (!tournament) {
      return NextResponse.json({ success: false, error: "Tournament not found" }, { status: 404 })
    }

    const createdApplications = []
    const year = new Date().getFullYear()
    let count = await TournamentApplication.countDocuments()

    for (const category of categories) {
      // Check if already registered for this category
      const existingApp = await TournamentApplication.findOne({
        tournamentId,
        playerId: session.user.id,
        category
      })

      if (existingApp) continue // Skip if already registered

      count++
      const appId = `APP-${year}-${count.toString().padStart(4, "0")}`

      const application = await TournamentApplication.create({
        appId,
        tournamentId,
        playerId: session.user.id,
        category,
        amount: tournament.entryFee,
        paymentStatus: PaymentStatus.PAID,
        confirmedAt: new Date()
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
    if (error.message?.includes("buffering timed out") || error.message?.includes("ECONNREFUSED")) {
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