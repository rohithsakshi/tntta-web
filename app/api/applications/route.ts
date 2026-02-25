import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "applications.json");

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
   POST - Apply to Tournament
========================= */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      tournamentId,
      playerName,
      lastName,
      gender,
      dob,
      district,
      contact,
      coach,
      club,
      category,
      paymentStatus,
      transactionId,
    } = body;

    /* ---------------------------
       Required Fields Check
    --------------------------- */
    if (
      !tournamentId ||
      !playerName ||
      !category ||
      paymentStatus !== "PAID" ||
      !transactionId
    ) {
      return NextResponse.json(
        { error: "Payment required before application" },
        { status: 400 }
      );
    }

    const applications = readData();

    /* ---------------------------
       Prevent Duplicate Application
    --------------------------- */
    const alreadyApplied = applications.find(
      (app: any) =>
        app.tournamentId === tournamentId &&
        app.playerName === playerName
    );

    if (alreadyApplied) {
      return NextResponse.json(
        { error: "You have already applied for this tournament" },
        { status: 400 }
      );
    }

    /* ---------------------------
       Create Application
    --------------------------- */
    const newApplication = {
      id: "APP_" + Date.now(),
      tournamentId,
      playerName,
      lastName,
      gender,
      dob,
      district,
      contact,
      coach,
      club,
      category,
      paymentStatus,
      transactionId,
      appliedAt: new Date().toISOString(),
    };

    applications.push(newApplication);
    writeData(applications);

    return NextResponse.json(
      { message: "Application successful", data: newApplication },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: "Server error during application" },
      { status: 500 }
    );
  }
}

/* =========================
   GET - Fetch Applications
========================= */

export async function GET() {
  try {
    const applications = readData();
    return NextResponse.json(applications, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch applications" },
      { status: 500 }
    );
  }
}