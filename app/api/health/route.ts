import { NextResponse } from "next/server"
import mongoose from "mongoose"
import connectToDatabase from "@/lib/mongodb"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await connectToDatabase()
    const isConnected = mongoose.connection.readyState === 1
    
    if (!isConnected) {
      throw new Error("MongoDB not connected")
    }

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
