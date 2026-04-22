# 🚀 TNTTA Vercel Deployment Guide

Follow these steps to deploy the TNTTA platform to Vercel with a live database.

## 1. Create a Vercel Postgres Database
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Select your project: `tntta-web`.
3. Click on the **Storage** tab.
4. Click **Create Database** and select **Postgres**.
5. Follow the prompts to create the database in your preferred region.

## 2. Link the Database to Your Project
1. Once created, click **Connect Project**.
2. Select your `tntta-web` project.
3. Vercel will automatically add environment variables like `POSTGRES_URL`, `DATABASE_URL`, etc.

## 3. Configure Authentication
You need to add these environment variables in your Vercel Project Settings (**Settings > Environment Variables**):

*   `AUTH_SECRET`: Generate a random string (e.g., run `openssl rand -base64 32`).
*   `NEXTAUTH_URL`: Your production URL (e.g., `https://tntta-web.vercel.app`).
*   `NODE_ENV`: Set to `production`.

## 4. Initialize the Database
Since the database is empty, you need to push your schema and seed initial data:

1. In your local terminal, link to your vercel project: `vercel link`.
2. Pull the environment variables: `vercel env pull .env.local`.
3. Push the schema: `npx prisma db push`.
4. (Optional) Seed the database: `npx prisma db seed`.

## 5. Redeploy
Go to the **Deployments** tab in Vercel and click **Redeploy** on the latest build.

---

### 💡 Why not "Without DB"?
The TNTTA platform relies on a database for:
*   **Player Registrations**: Storing athlete profiles and categories.
*   **Tournament Management**: Creating and updating event details.
*   **Real-time Rankings**: Calculating points after matches.
*   **Admin Dashboard**: Securely managing the association's content.

By using Vercel's free Postgres tier, you get all these features without any monthly cost for low-to-medium traffic.
