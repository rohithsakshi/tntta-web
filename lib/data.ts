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
    console.error("Error fetching tournaments:", error)
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
    console.error("Error fetching news:", error)
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
    console.error("Error fetching results:", error)
    return []
  }
}
