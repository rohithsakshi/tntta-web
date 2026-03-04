import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "registrations.json");

/* =========================
   File Utilities
========================= */

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
   POST - Create Player Registration
========================= */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      gender,
      dob,
      district,
      contact,
      club,
      category,
      password,
    } = body;

    // Basic validation
    if (
      !firstName ||
      !lastName ||
      !gender ||
      !dob ||
      !district ||
      !contact ||
      !club ||
      !category ||
      !password
    ) {
      return NextResponse.json(
        { error: "All fields including password are required" },
        { status: 400 }
      );
    }

    const registrations = readData();

    // Better duplicate check (contact should be unique)
    const existingUser = registrations.find(
      (user: any) =>
        user.contact === contact
    );

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this contact number" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newPlayer = {
      id: "PLY_" + Date.now(),
      firstName,
      lastName,
      gender,
      dob,
      district,
      contact,
      club,
      category,
      password: hashedPassword,
      role: "player",
      createdAt: new Date().toISOString(),
    };

    registrations.push(newPlayer);
    writeData(registrations);

    return NextResponse.json(
      { message: "Registration successful", playerId: newPlayer.id },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: "Server error during registration" },
      { status: 500 }
    );
  }
}

/* =========================
   GET - Fetch Registrations
========================= */

export async function GET() {
  try {
    const registrations = readData();
    return NextResponse.json(registrations, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch registrations" },
      { status: 500 }
    );
  }
}