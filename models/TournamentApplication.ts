import mongoose, { Schema, model, models } from "mongoose";
import { PaymentStatus } from "./enums";

const TournamentApplicationSchema = new Schema(
  {
    appId: {
      type: String,
      required: true,
      unique: true,
    },
    tournamentId: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    playerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    confirmedAt: {
      type: Date,
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

TournamentApplicationSchema.index({ appId: 1 });
TournamentApplicationSchema.index({ tournamentId: 1, playerId: 1 });

const TournamentApplication = models.TournamentApplication || model("TournamentApplication", TournamentApplicationSchema);

export default TournamentApplication;
