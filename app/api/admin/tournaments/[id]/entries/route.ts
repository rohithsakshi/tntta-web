import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { UserRole } from "@prisma/client"

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
    if (!prisma) throw new Error("Prisma not initialized")

    const entries = await prisma.tournamentApplication.findMany({
      where: { tournamentId },
      include: {
        player: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            tnttaId: true,
            district: true,
            category: true
          }
        }
      }
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error("Fetch entries error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
