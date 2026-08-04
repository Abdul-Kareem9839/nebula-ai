import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    avatarUrl: {
      type: String,
      default: null,
    },

    bio: {
      type: String,
      default: "",
    },

    // Interview Preferences
    targetRole: {
      type: String,
      default: null,
    },

    skillLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: null,
    },

    preferredLanguage: {
      type: String,
      default: "JavaScript",
    },

    preferences: {
      mentorPersonality: {
        type: String,
        enum: [
          "friendly",
          "strict",
          "supportive",
          "senior_engineer",
          "hr_recruiter",
          "startup_founder",
        ],
        default: "friendly",
      },

      interviewMode: {
        type: String,
        enum: ["text", "voice"],
        default: "text",
      },
    },

    // Resume
    resume: {
      url: {
        type: String,
        default: null,
      },

      uploadedAt: Date,

      summary: {
        type: String,
        default: "",
      },

      extractedSkills: {
        type: [String],
        default: [],
      },

      extractedProjects: {
        type: [String],
        default: [],
      },
    },

    careerProfile: {
      knownSkills: {
        type: [String],
        default: [],
      },
      weakSkills: {
        type: [String],
        default: [],
      },
      averageScore: {
        type: Number,
        default: 0,
      },
      averageConfidence: {
        type: Number,
        default: 0,
      },
      frequentlyAskedTopics: {
        type: [String],
        default: [],
      },
      interviewCount: {
        type: Number,
        default: 0,
      },
      strongestArea: {
        type: String,
        default: "",
      },
      weakestArea: {
        type: String,
        default: "",
      },
    },

    // Dashboard Stats
    stats: {
      interviewsCompleted: {
        type: Number,
        default: 0,
      },

      totalQuestionsAnswered: {
        type: Number,
        default: 0,
      },

      averageScore: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
