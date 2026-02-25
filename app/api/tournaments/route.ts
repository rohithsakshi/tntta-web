import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "tournaments.json");

function ensureFileExists() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
  }
}

function readData() {
  ensureFileExists();
  const file = fs.readFileSync(filePath, "utf8");
  try {
    return JSON.parse(file);
  } catch {
    return [];
  }
}

function writeData(data: any) {
  ensureFileExists();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/* =========================
   POST - Create Tournament
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

    const tournaments = readData();

    const newTournament = {
      id: Date.now().toString(),
      title,
      location,
      startDate,
      endDate,
      createdAt: new Date().toISOString(),
    };

    tournaments.push(newTournament);
    writeData(tournaments);

    return NextResponse.json(
      { message: "Tournament created successfully", data: newTournament },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Server error creating tournament" },
      { status: 500 }
    );
  }
}

/* =========================
   GET - Fetch Tournaments
========================= */

export async function GET() {
  try {
    const tournaments = readData();
    return NextResponse.json(tournaments, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch tournaments" },
      { status: 500 }
    );
  }
}