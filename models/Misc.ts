import mongoose, { Schema, model, models } from "mongoose";
import { TableStatusEnum } from "./enums";

// NewsItem
const NewsItemSchema = new Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    publishedAt: { type: Date, default: Date.now },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// GalleryImage
const GalleryImageSchema = new Schema(
  {
    url: { type: String, required: true },
    caption: { type: String },
    tournamentId: { type: Schema.Types.ObjectId, ref: "Tournament" },
    uploadedById: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// TableStatus
const TableStatusSchema = new Schema(
  {
    tournamentId: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
    tableNumber: { type: Number, required: true },
    currentMatchId: { type: Schema.Types.ObjectId, ref: "MatchSlot" },
    nextMatchId: { type: Schema.Types.ObjectId, ref: "MatchSlot" },
    status: { type: String, enum: Object.values(TableStatusEnum), default: TableStatusEnum.IDLE },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
TableStatusSchema.index({ tournamentId: 1, tableNumber: 1 }, { unique: true });

// RankingEntry
const RankingEntrySchema = new Schema(
  {
    playerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    points: { type: Number, required: true },
    rank: { type: Number, required: true },
    season: { type: String, required: true }, // e.g., "2025-26"
  },
  { timestamps: true }
);

// TournamentBracket
const TournamentBracketSchema = new Schema(
  {
    tournamentId: { type: Schema.Types.ObjectId, ref: "Tournament", required: true, unique: true },
    category: { type: String, required: true },
    eventType: { type: String, required: true },
    totalPlayers: { type: Number, required: true },
    totalRounds: { type: Number, required: true },
    bracketData: { type: Schema.Types.Mixed, required: true },
    generatedAt: { type: Date, default: Date.now },
    isSeeded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// MatchResult
const MatchResultSchema = new Schema(
  {
    tournamentId: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
    player1Id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    player2Id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    score: { type: String, required: true }, // e.g., "11-8, 9-11, 11-6, 11-7"
    winnerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    round: { type: String, required: true },
    category: { type: String, required: true },
    playedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Advertisement
const AdSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    imageUrl: { type: String },
    link: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const NewsItem = models.NewsItem || model("NewsItem", NewsItemSchema);
export const GalleryImage = models.GalleryImage || model("GalleryImage", GalleryImageSchema);
export const TableStatus = models.TableStatus || model("TableStatus", TableStatusSchema);
export const RankingEntry = models.RankingEntry || model("RankingEntry", RankingEntrySchema);
export const TournamentBracket = models.TournamentBracket || model("TournamentBracket", TournamentBracketSchema);
export const MatchResult = models.MatchResult || model("MatchResult", MatchResultSchema);
export const Ad = models.Ad || model("Ad", AdSchema);
