import connectToDatabase from "./mongodb";
import { User, Tournament, MatchSlot, NewsItem, MatchResult } from "@/models";
import mongoose from "mongoose";

export async function getUpcomingTournaments() {
  try {
    await connectToDatabase();
    const tournaments = await Tournament.find({
      status: { $in: ["OPEN", "ONGOING", "UPCOMING"] }
    })
    .sort({ startDate: 1 })
    .limit(3)
    .lean();
    
    return tournaments.map((t: any) => ({ 
      ...t, 
      id: t._id.toString(),
      startDate: t.startDate?.toISOString() || new Date().toISOString(),
      endDate: t.endDate?.toISOString() || new Date().toISOString(),
    }));
  } catch (error) {
    console.info("Server Info: Upcoming tournaments currently unavailable (Offline).");
    return [];
  }
}

export async function getLatestNews() {
  try {
    await connectToDatabase();
    const news = await NewsItem.find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(2)
      .lean();
    return news.map((n: any) => ({ 
      ...n, 
      id: n._id.toString(),
      publishedAt: n.publishedAt?.toISOString() || new Date().toISOString()
    }));
  } catch (error) {
    console.info("Server Info: Latest news currently unavailable (Offline).");
    return [];
  }
}

export async function getRecentResults() {
  try {
    await connectToDatabase();
    // Try to get from MatchResult first
    let resultsRaw = await MatchResult.find({})
      .sort({ playedAt: -1 })
      .limit(5)
      .populate("player1Id")
      .populate("player2Id")
      .populate("tournamentId")
      .lean();

    if (resultsRaw.length === 0) {
      // Fallback to completed MatchSlots
      resultsRaw = await MatchSlot.find({ status: "COMPLETED" })
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate("player1Id")
        .populate("player2Id")
        .populate("tournamentId")
        .lean();
    }

    return resultsRaw
      .filter((r: any) => r.player1Id && r.player2Id && r.tournamentId)
      .map((r: any) => ({
        ...r,
        id: r._id.toString(),
        player1: { ...r.player1Id, id: r.player1Id._id.toString() },
        player2: { ...r.player2Id, id: r.player2Id._id.toString() },
        tournament: { ...r.tournamentId, id: r.tournamentId._id.toString() }
      }));
  } catch (error) {
    console.info("Server Info: Database results currently unavailable (Offline).");
    return [];
  }
}

export async function getTopPlayers() {
  try {
    await connectToDatabase();
    const players = await User.find({
      role: "PLAYER",
      $or: [
        { isFeatured: true },
        { rankingPoints: { $gt: 0 } }
      ]
    })
    .sort({ isFeatured: -1, rankingPoints: -1 })
    .limit(6)
    .lean();
    return players.map((p: any) => ({ ...p, id: p._id.toString() }));
  } catch (error) {
    console.info("Server Info: Top players currently unavailable (Offline).");
    return [];
  }
}

export async function getRankingsSummary() {
  try {
    await connectToDatabase();
    const rankings = await User.find({ role: "PLAYER" })
      .sort({ rankingPoints: -1 })
      .limit(5)
      .lean();
    return rankings.map((r: any) => ({ ...r, id: r._id.toString() }));
  } catch (error) {
    console.info("Server Info: Rankings summary currently unavailable (Offline).");
    return [];
  }
}

export async function getLiveMatches() {
  try {
    await connectToDatabase();
    const matchesRaw = await MatchSlot.find({ status: "IN_PROGRESS" })
      .populate("player1Id")
      .populate("player2Id")
      .populate("tournamentId")
      .limit(5)
      .lean();
      
    return matchesRaw
      .filter((m: any) => m.player1Id && m.player2Id && m.tournamentId)
      .map((m: any) => ({
        ...m,
        id: m._id.toString(),
        player1: { ...m.player1Id, id: m.player1Id._id.toString() },
        player2: { ...m.player2Id, id: m.player2Id._id.toString() },
        tournament: { ...m.tournamentId, id: m.tournamentId._id.toString() }
      }));
  } catch (error) {
    console.info("Server Info: Live matches currently unavailable (Offline).");
    return [];
  }
}

export async function getTournamentWinners() {
  try {
    await connectToDatabase();
    const winnersRaw = await MatchSlot.find({ 
      round: { $regex: /final/i },
      status: "COMPLETED"
    })
    .sort({ updatedAt: -1 })
    .limit(6)
    .populate("winnerId")
    .lean();
    
    return winnersRaw
      .filter((w: any) => w.winnerId)
      .map((w: any) => ({
        ...w.winnerId,
        id: w.winnerId._id.toString()
      }));
  } catch (error) {
    console.info("Server Info: Tournament winners currently unavailable (Offline).");
    return [];
  }
}
