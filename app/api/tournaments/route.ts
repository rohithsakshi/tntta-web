import { NextResponse } from "next/server";

/* =========================
   POST - Create Tournament (Demo Mode)
========================= */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, location, startDate, endDate } = body;

    if (!title || !location || !startDate || !endDate) {
      return NextResponse.json(
        { error: "All tournament fields are required" },
        { status: 400 }
      );
    }

    // Simulate server delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newTournament = {
      id: "TNT_" + Date.now(),
      title,
      location,
      startDate,
      endDate,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        message: "Tournament created successfully (Demo Mode)",
        data: newTournament,
      },
      { status: 201 }
    );

  } catch {
    return NextResponse.json(
      { error: "Server error creating tournament" },
      { status: 500 }
    );
  }
}

/* =========================
   GET - Fetch Tournaments (Demo Mode)
========================= */

export async function GET() {
  return NextResponse.json(
    [
      {
        id: "TNT_1",
        title: "7th TNTTA State Ranking Table Tennis Tournament 2025",
        location: "SK Academy, Chennai",
        startDate: "2026-02-25",
        endDate: "2026-02-28",
      },
    ],
    { status: 200 }
  );
}