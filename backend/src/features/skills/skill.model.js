import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },

    level: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },

    interviewsAppeared: {
      type: Number,
      default: 0,
    },

    lastPracticed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

skillSchema.index(
  {
    userId: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

export const UserSkill = mongoose.model("UserSkill", skillSchema);
