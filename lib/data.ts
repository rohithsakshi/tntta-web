import prisma from "./prisma"

export async function getUpcomingTournaments() {
  if (!prisma) return []
  
  try {
    const tournaments = await prisma.tournament.findMany({
      where: { status: "OPEN" },
      orderBy: { startDate: "asc" },
      take: 3,
    })
    return tournaments
  } catch (error) {
    console.info("Info: Upcoming tournaments currently unavailable (Offline).")
    return []
  }
}

export async function getLatestNews() {
  if (!prisma) return []
  
  try {
    const news = await prisma.newsItem.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 2,
    })
    return news
  } catch (error) {
    console.info("Info: Latest news currently unavailable (Offline).")
    return []
  }
}

export async function getRecentResults() {
  if (!prisma) return []
  
  try {
    const results = await prisma.matchResult.findMany({
      orderBy: { playedAt: "desc" },
      take: 5,
      include: {
        player1: true,
        player2: true,
        tournament: true,
      },
    })
    return results
  } catch (error) {
    console.info("Info: Database results currently unavailable (Offline).")
    return []
  }
}

