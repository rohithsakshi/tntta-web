import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(), 
      dbConnected: true 
    })
  } catch (error) {
    return NextResponse.json({ 
      status: "error", 
      timestamp: new Date().toISOString(), 
      dbConnected: false 
    }, { status: 500 })
  }
}
