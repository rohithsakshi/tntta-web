import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const filePath = path.join(process.cwd(), "data", "registrations.json");

/* =========================
   Utility - Read Users
========================= */

function readData() {
  if (!fs.existsSync(filePath)) return [];
  const file = fs.readFileSync(filePath, "utf8");
  try {
    return JSON.parse(file);
  } catch {
    return [];
  }
}

/* =========================
   POST - Login
========================= */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const firstName = body.firstName?.trim();
    const password = body.password;
    const role = body.role?.trim();

    if (!firstName || !password) {
      return NextResponse.json(
        { error: "First Name and password required" },
        { status: 400 }
      );
    }

    /* =========================
       🔐 ADMIN LOGIN
    ========================= */

    if (role === "Admin") {
      if (firstName.toLowerCase() === "admin" && password === "admin123") {
        return NextResponse.json(
          { message: "Admin login successful", role: "admin" },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    /* =========================
       👤 PLAYER LOGIN
    ========================= */

    const users = readData();

    const inputName = firstName.toLowerCase();

    const user = users.find(
      (u: any) =>
        u.firstName &&
        u.firstName.trim().toLowerCase() === inputName &&
        u.role === "player"
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "Login successful",
        role: "player",
        user: {
          id: user.id,
          firstName: user.firstName,
          role: user.role,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Server error during login" },
      { status: 500 }
    );
  }
}