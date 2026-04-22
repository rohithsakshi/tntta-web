import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { playerRegistrationSchema } from "@/lib/validations"
import { UserRole } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = playerRegistrationSchema.parse(body)

    // Check if contact already exists
    const existingUser = await prisma.user.findUnique({
      where: { contact: validatedData.contact }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "A player with this contact number already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 10)

    // Generate TNTTA ID (TNTTA-YYYY-XXXX)
    const year = new Date().getFullYear()
    const count = await prisma.user.count()
    const tnttaId = `TNTTA-${year}-${(count + 1).toString().padStart(4, "0")}`

    // Create user
    const user = await prisma.user.create({
      data: {
        tnttaId,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email || null,
        contact: validatedData.contact,
        passwordHash,
        gender: validatedData.gender,
        dob: validatedData.dob,
        district: validatedData.district,
        club: validatedData.club || null,
        category: validatedData.category,
        role: UserRole.PLAYER,
      }
    })

    return NextResponse.json({ 
      success: true, 
      tnttaId: user.tnttaId, 
      message: "Registration successful" 
    })

  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}