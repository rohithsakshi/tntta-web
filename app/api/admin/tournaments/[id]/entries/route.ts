import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { TournamentApplication, UserRole } from "@/models"
import { auth } from "@/lib/auth"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id: tournamentId } = await params

  try {
    await connectToDatabase()
    
    const entries = await TournamentApplication.find({ tournamentId })
      .populate({
        path: "playerId",
        select: "id firstName lastName tnttaId district category"
      })
      .lean()

    const normalizedEntries = entries.map((entry: any) => ({
      ...entry,
      id: entry._id.toString(),
      player: entry.playerId
    }))

    return NextResponse.json(normalizedEntries)
  } catch (error) {
    console.error("Fetch entries error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
