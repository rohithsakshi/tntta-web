import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, password, role } = body;

    if (!firstName || !password) {
      return NextResponse.json(
        { error: "First Name and password required" },
        { status: 400 }
      );
    }

    // Admin Login
    if (role === "Admin") {
      if (firstName.toLowerCase() === "admin" && password === "admin123") {
        return NextResponse.json({
          message: "Admin login successful",
          role: "admin",
        });
      }

      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    // Demo Player Login (accept any credentials)
    return NextResponse.json({
      message: "Demo player login successful",
      role: "player",
    });

  } catch {
    return NextResponse.json(
      { error: "Server error during login" },
      { status: 500 }
    );
  }
}