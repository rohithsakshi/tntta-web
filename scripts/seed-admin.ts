import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { UserRole, Gender } from "../models/enums";

// 1. Robustly parse the .env file to extract database configuration
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) return;
    const match = trimmedLine.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let val = match[2] || "";
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      } else if (val.startsWith("'") && val.endsWith("'")) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tntta";

async function seedAdmin() {
  console.log("----------------------------------------");
  console.log("⚡ Starting TNTTA Admin Database Seeding");
  console.log("----------------------------------------");

  try {
    // 2. Connect to MongoDB
    console.log(`Connecting to MongoDB at: ${MONGODB_URI.replace(/:([^@]+)@/, ":****@")}`);
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    console.log("✅ Successfully connected to MongoDB!");

    // 3. Define Admin account credentials and details
    const adminPassword = "Admin@123";
    const adminContact = "9999999999";
    const adminEmail = "admin@tntta.com";
    const adminId = "TNTTA-ADMIN";

    console.log(`Generating secure hash for password...`);
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    const adminData = {
      tnttaId: adminId,
      firstName: "TNTTA",
      lastName: "Admin",
      email: adminEmail,
      contact: adminContact,
      passwordHash: passwordHash,
      gender: Gender.MALE,
      dob: new Date("1990-01-01"),
      district: "Chennai",
      role: UserRole.ADMIN,
      isActive: true,
    };

    // 4. Check if Admin already exists to perform safe upsert
    const existingAdmin = await User.findOne({
      $or: [
        { tnttaId: adminId },
        { contact: adminContact },
        { email: adminEmail }
      ]
    });

    if (existingAdmin) {
      console.log(`⚠️ Admin already exists with ID: ${existingAdmin.tnttaId} or Contact: ${existingAdmin.contact}.`);
      console.log("Updating Admin account credentials and permissions...");
      
      existingAdmin.firstName = adminData.firstName;
      existingAdmin.lastName = adminData.lastName;
      existingAdmin.email = adminData.email;
      existingAdmin.contact = adminData.contact;
      existingAdmin.passwordHash = adminData.passwordHash;
      existingAdmin.gender = adminData.gender;
      existingAdmin.dob = adminData.dob;
      existingAdmin.district = adminData.district;
      existingAdmin.role = adminData.role;
      existingAdmin.isActive = adminData.isActive;

      await existingAdmin.save();
      console.log("🎉 Admin user account updated successfully!");
    } else {
      console.log("No existing Admin found. Seeding a new Admin user account...");
      const newAdmin = new User(adminData);
      await newAdmin.save();
      console.log("🎉 Admin user seeded successfully!");
    }

    console.log("\n🔑 Admin Login Details:");
    console.log(`- Contact Number: ${adminContact}`);
    console.log(`- Password:       ${adminPassword}`);
    console.log(`- Role:           ${UserRole.ADMIN}`);
    console.log("----------------------------------------");

  } catch (error) {
    console.error("❌ Seeding failed with an error:", error);
  } finally {
    // 5. Always clean up connection
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    console.log("----------------------------------------");
  }
}

seedAdmin();
