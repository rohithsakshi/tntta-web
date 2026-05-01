import { NextRequest, NextResponse } from "next/server";
import { checkNoShows } from "@/lib/fixtures/noshow-checker";

export async function GET(req: NextRequest) {
  // Verify Cron Secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const results = await checkNoShows();
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "No-show check failed" }, { status: 500 });
  }
}
