import mongoose, { Schema, model, models } from "mongoose";
import { UserRole, Gender, Category } from "./enums";

const UserSchema = new Schema(
  {
    tnttaId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows null/missing values while still being unique
    },
    contact: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    club: {
      type: String,
    },
    categories: [
      {
        type: String,
        enum: Object.values(Category),
      },
    ],
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.PLAYER,
    },
    profilePhoto: {
      type: String,
    },
    rankingPoints: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

// Add index for common queries
UserSchema.index({ tnttaId: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ contact: 1 });

const User = models.User || model("User", UserSchema);

export default User;
