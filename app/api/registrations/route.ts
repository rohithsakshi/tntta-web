import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "registrations.json");

function readData() {
  const file = fs.readFileSync(filePath, "utf8");
  return JSON.parse(file);
}

function writeData(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  return NextResponse.json(readData());
}

export async function POST(request: Request) {
  const body = await request.json();
  const registrations = readData();

  const { tournamentId, name } = body;

  if (!name || name.trim() === "") {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  const newRegistration = {
    id: Date.now().toString(),
    tournamentId,
    name,
  };

  registrations.push(newRegistration);
  writeData(registrations);

  return NextResponse.json(
    { message: "Registration successful", data: newRegistration },
    { status: 201 }
  );
}