import prisma from "./prisma"
import type { User as PrismaUser } from "@prisma/client"

export async function getUpcomingTournaments() {
  if (!prisma) return []
  
  try {
    const tournaments = await prisma.tournament.findMany({
      where: { 
        status: { in: ["OPEN", "ONGOING"] } 
      },
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

export async function getTopPlayers() {
  if (!prisma) return []
  
  try {
    const players = await prisma.user.findMany({
      where: { 
        role: "PLAYER",
        OR: [
          { isFeatured: true },
          { rankingPoints: { gt: 0 } }
        ]
      },
      orderBy: [
        { isFeatured: "desc" },
        { rankingPoints: "desc" }
      ],
      take: 6,
    })
    return players
  } catch (error) {
    console.info("Info: Top players currently unavailable (Offline).")
    return []
  }
}

export async function getRankingsSummary() {
  if (!prisma) return []
  
  try {
    const rankings = await prisma.user.findMany({
      where: { role: "PLAYER" },
      orderBy: { rankingPoints: "desc" },
      take: 5,
    })
    return rankings
  } catch (error) {
    console.info("Info: Rankings summary currently unavailable (Offline).")
    return []
  }
}

export async function getLiveMatches() {
  if (!prisma) return []
  
  try {
    const matches = await prisma.matchSlot.findMany({
      where: { status: "IN_PROGRESS" },
      include: {
        player1: true,
        player2: true,
        tournament: true,
      },
      take: 5,
    })
    return matches
  } catch (error) {
    console.info("Info: Live matches currently unavailable (Offline).")
    return []
  }
}

export async function getTournamentWinners() {
  if (!prisma) return []
  
  try {
    const winners = await prisma.matchResult.findMany({
      where: { round: { in: ["Final", "FINAL"] } },
      orderBy: { playedAt: "desc" },
      take: 6,
      include: {
        winner: true,
      },
    })
    return winners.map((w: { winner: PrismaUser }) => w.winner)
  } catch (error) {
    console.info("Info: Tournament winners currently unavailable (Offline).")
    return []
  }
}

