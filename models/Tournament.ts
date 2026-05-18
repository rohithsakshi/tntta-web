import mongoose, { Schema, model, models } from "mongoose";
import { TournamentStatus, TournamentType } from "./enums";

const TournamentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: Object.values(TournamentType),
      default: TournamentType.STATE_RANKING,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    registrationOpens: {
      type: Date,
      required: true,
    },
    registrationDeadline: {
      type: Date,
      required: true,
    },
    entryFee: {
      type: Number,
      required: true,
    },
    maxParticipants: {
      type: Number,
    },
    categories: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: Object.values(TournamentStatus),
      default: TournamentStatus.UPCOMING,
    },
    posterUrl: {
      type: String,
    },
    createdById: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

TournamentSchema.index({ slug: 1 });
TournamentSchema.index({ status: 1 });

const Tournament = models.Tournament || model("Tournament", TournamentSchema);

export default Tournament;
