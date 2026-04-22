import prisma from "./prisma"

// Mock Data
const MOCK_TOURNAMENTS = [
  {
    id: "mock-1",
    slug: "state-ranking-2025",
    title: "84th State Ranking Championship 2025",
    startDate: new Date("2025-06-15"),
    endDate: new Date("2025-06-18"),
    venue: "Nehru Indoor Stadium",
    location: "Chennai",
    entryFee: 50000,
    status: "OPEN"
  },
  {
    id: "mock-2",
    slug: "district-open-2025",
    title: "District Open Tournament - Madurai",
    startDate: new Date("2025-07-10"),
    endDate: new Date("2025-07-12"),
    venue: "District Sports Complex",
    location: "Madurai",
    entryFee: 30000,
    status: "OPEN"
  }
]

const MOCK_NEWS = [
  {
    id: "news-1",
    title: "Tamil Nadu Players Shine at Nationals",
    excerpt: "Record-breaking performance by our junior players in the recently concluded national championships.",
    publishedAt: new Date(),
    imageUrl: "https://media.istockphoto.com/id/1425158165/photo/table-tennis-ping-pong-paddles-and-white-ball-on-blue-board.jpg?s=612x612&w=is&k=20&c=q7kPR8BzNCOngSWY5t-VHNYfTK3_iQq4klx22sNAvS8=",
    isPublished: true
  },
  {
    id: "news-2",
    title: "New Coaching Camp Announced",
    excerpt: "TNTTA announces a high-performance coaching camp for sub-junior categories starting next month.",
    publishedAt: new Date(),
    imageUrl: "https://media.istockphoto.com/id/178826162/photo/service-on-table-tennis.jpg?s=612x612&w=is&k=20&c=wN1HhMjrniuoHWhYs2BAobaIGUN_N6qJPjhnq9td1Tc=",
    isPublished: true
  }
]

export async function getUpcomingTournaments() {
  if (!prisma) return MOCK_TOURNAMENTS
  
  try {
    const tournaments = await prisma.tournament.findMany({
      where: { status: "OPEN" },
      orderBy: { startDate: "asc" },
      take: 3,
    })
    return tournaments.length > 0 ? tournaments : MOCK_TOURNAMENTS
  } catch (error) {
    console.error("Database fetch failed, using mock tournaments")
    return MOCK_TOURNAMENTS
  }
}

export async function getLatestNews() {
  if (!prisma) return MOCK_NEWS
  
  try {
    const news = await prisma.newsItem.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 2,
    })
    return news.length > 0 ? news : MOCK_NEWS
  } catch (error) {
    console.error("Database fetch failed, using mock news")
    return MOCK_NEWS
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
    console.error("Database fetch failed for results")
    return []
  }
}
