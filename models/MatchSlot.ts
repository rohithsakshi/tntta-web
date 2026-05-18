import mongoose, { Schema, model, models } from "mongoose";
import { MatchStatus, EventType } from "./enums";

const MatchSlotSchema = new Schema(
  {
    tournamentId: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    matchNumber: {
      type: Number,
      required: true,
    },
    tableNumber: {
      type: Number,
      required: true,
    },
    scheduledStartTime: {
      type: Date,
      required: true,
    },
    scheduledEndTime: {
      type: Date,
      required: true,
    },
    actualStartTime: {
      type: Date,
    },
    actualEndTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(MatchStatus),
      default: MatchStatus.SCHEDULED,
    },
    round: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      enum: Object.values(EventType),
      required: true,
    },
    player1Id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    player2Id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    doubles1Partner1Id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    doubles1Partner2Id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    doubles2Partner1Id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    doubles2Partner2Id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    winnerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    score: {
      type: String,
    },
    noShowGraceUntil: {
      type: Date,
    },
    player1Present: {
      type: Boolean,
      default: true,
    },
    player2Present: {
      type: Boolean,
      default: true,
    },
    delayMinutes: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
    },
    teamMatchId: {
      type: Schema.Types.ObjectId,
      ref: "TeamMatch",
    },
    roundNumber: {
      type: Number,
      default: 1,
    },
    position: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

MatchSlotSchema.index({ tournamentId: 1, status: 1 });
MatchSlotSchema.index({ tournamentId: 1, tableNumber: 1, scheduledStartTime: 1 });

const MatchSlot = models.MatchSlot || model("MatchSlot", MatchSlotSchema);

export default MatchSlot;
