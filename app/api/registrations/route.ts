import { NextResponse } from "next/server";

/* =========================
   POST - Register Player (Demo Mode)
========================= */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.firstName || !body.password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json(
      {
        message: "Registration successful (Demo Mode)",
        playerId: "PLY_" + Date.now(),
      },
      { status: 201 }
    );

  } catch {
    return NextResponse.json(
      { error: "Server error during registration" },
      { status: 500 }
    );
  }
}

/* =========================
   GET - Fetch Registrations (Demo Mode)
========================= */

export async function GET() {
  return NextResponse.json(
    [
      {
        id: "PLY_1",
        firstName: "Demo",
        lastName: "Player",
        category: "Senior",
      },
    ],
    { status: 200 }
  );
}