# TNTTA Platform Revamp

Official Tamil Nadu Table Tennis Association full-stack web platform.

## Tech Stack
- **Framework:** Next.js 14 App Router
- **Styling:** Tailwind CSS v3/v4
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** NextAuth.js v5
- **Payment:** Razorpay (Coming Soon)
- **File Uploads:** Uploadthing
- **Email:** Resend

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and fill in the required values:
```bash
cp .env.example .env
```

### 3. Database Setup
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Run Locally
```bash
npm run dev
```

## Admin Credentials
- **Contact:** 9999999999
- **Password:** Admin@123

## Sitemaps

### Public
- `/` - Home
- `/tournaments` - Listing
- `/rankings` - Player Rankings
- `/results` - Match Results
- `/gallery` - Photos
- `/login` / `/register` - Auth

### Player
- `/dashboard` - Overview
- `/dashboard/profile` - Profile Management
- `/dashboard/tournaments` - My Entries

### Admin
- `/admin` - Dashboard
- `/admin/tournaments` - Manage Tournaments
- `/admin/players` - Player Management
- `/admin/results` - Enter Results
- `/admin/rankings` - Update Rankings
