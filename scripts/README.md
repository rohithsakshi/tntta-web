# TNTTA Database Seeding & Administration

This directory contains standalone scripts for database administration, maintenance, and setup.

## 📋 Table of Contents
1. [Seeding the Admin User](#-seeding-the-admin-user)
2. [How It Works (Implementation Plan)](#-how-it-works-implementation-plan)
3. [Troubleshooting Connection Issues](#-troubleshooting-connection-issues)

---

## 🔑 Seeding the Admin User

To seed the primary administrator account into the database, follow these steps:

### 1. Configure the MongoDB URI
Open your root `.env` file and set the `MONGODB_URI` environment variable:

*   **For Local MongoDB:**
    ```env
    MONGODB_URI="mongodb://localhost:27017/tntta"
    ```
*   **For Hosted MongoDB Atlas:**
    ```env
    MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/tntta?retryWrites=true&w=majority"
    ```

### 2. Run the Seed Command
Execute the following shortcut command from the project root:
```bash
npm run db:seed-admin
```

This will automatically:
1. Connect to your database.
2. Securely hash the default password (`Admin@123`) using `bcryptjs`.
3. Check if an admin already exists (and update their details if they do, to avoid duplicate keys).
4. Output the success confirmation and login details.

Once seeded, log in with:
*   **Contact:** `9999999999`
*   **Password:** `Admin@123`
*   **Role:** `ADMIN`

---

## ⚙️ How It Works (Implementation Plan)

The database seeding process follows a strict and secure architectural flow:

```
[Start Seeding]
       │
       ▼
[Parse .env Config] ──► Reads MONGODB_URI (falls back to local defaults)
       │
       ▼
[Connect to DB] ──────► Establishes mongoose connection
       │
       ▼
[Password Hashing] ───► Generates secure salt + bcrypt hash for 'Admin@123'
       │
       ▼
[Check Existing] ─────► Finds existing user by tnttaId, contact, or email
       │
 ┌─────┴────────┐
 ▼ (Exists)     ▼ (New)
[Update User]  [Create User]
 └─────┬────────┘
       │
       ▼
[Close DB Conn] ──────► Closes mongoose connection and displays success info
```

- **Path Resolvers:** We use `tsx` to run the TypeScript file. `tsx` uses speed-optimized esbuild to dynamically resolve standard ES Modules, avoiding module loader compatibility issues.
- **Idempotence & Safety:** The script uses an upsert check via `findOne` with `$or`. This guarantees that you can safely run the seed script as many times as you want without crashing on duplicate key errors.

---

## ⚠️ Troubleshooting Connection Issues

If you run the script and receive `MongooseServerSelectionError: connect ECONNREFUSED`:

1. **Verify Local MongoDB Server:** Ensure your local MongoDB server is running. You can check if the MongoDB service is active or open **MongoDB Compass** to verify local database status.
2. **Whitelist Atlas IP:** If connecting to MongoDB Atlas, make sure your current public IP address is whitelisted in your Atlas Network Security console.
