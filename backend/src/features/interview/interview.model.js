import mongoose from "mongoose";

const turnSchema = new mongoose.Schema(
  {
    question: {
      text: {
        type: String,
        required: true,
      },

      topic: {
        type: String,
        default: "",
      },

      difficulty: {
        type: String,
        enum: ["easy", "medium", "hard", "expert"],
        default: "medium",
      },
    },

    answer: {
      text: {
        type: String,
        default: "",
      },

      duration: {
        type: Number,
        default: 0,
      },

      confidence: {
        type: Number,
        default: 0,
      },
    },

    evaluation: {
      score: {
        type: Number,
        default: 0,
      },

      reason: {
        type: String,
        default: "",
      },

      feedback: {
        type: String,
        default: "",
      },

      strengths: {
        type: [String],
        default: [],
      },

      weaknesses: {
        type: [String],
        default: [],
      },

      improvedAnswer: {
        type: String,
        default: "",
      },
    },
  },
  {
    _id: false,
  },
);

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    role: {
      type: String,
      required: true,
    },

    skillLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },

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

    type: {
      type: String,
      enum: ["technical", "behavioral", "coding"],
      default: "technical",
    },

    mode: {
      type: String,
      enum: ["manual", "resume"],
      default: "manual",
    },

    resumeAnalysis: {
      skills: {
        type: [String],
        default: [],
      },
      projects: {
        type: [String],
        default: [],
      },
      experience: {
        type: [String],
        default: [],
      },
      education: {
        type: [String],
        default: [],
      },
      certifications: {
        type: [String],
        default: [],
      },
      strengths: {
        type: [String],
        default: [],
      },
      weaknesses: {
        type: [String],
        default: [],
      },
    },

    status: {
      type: String,
      enum: ["in_progress", "completed", "paused", "abandoned"],
      default: "in_progress",
    },

    maxQuestions: {
      type: Number,
      default: 5,
    },

    turns: [turnSchema],

    overallScore: {
      type: Number,
      default: null,
    },

    technicalScore: {
      type: Number,
      default: null,
    },

    communicationScore: {
      type: Number,
      default: null,
    },

    problemSolvingScore: {
      type: Number,
      default: null,
    },

    confidenceScore: {
      type: Number,
      default: null,
    },

    summary: {
      strengths: {
        type: [String],
        default: [],
      },

      weaknesses: {
        type: [String],
        default: [],
      },

      overallFeedback: {
        type: String,
        default: "",
      },
    },

    skills: [
      {
        name: String,
        score: Number,
        confidence: Number,
        level: Number,
      },
    ],

    ai: {
      provider: String,
      model: String,
      promptTokens: Number,
      completionTokens: Number,
      totalTokens: Number,
    },
  },
  {
    timestamps: true,
  },
);

export const Interview = mongoose.model("Interview", interviewSchema);
