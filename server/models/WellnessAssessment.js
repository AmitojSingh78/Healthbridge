const mongoose = require("mongoose");

const wellnessAssessmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    healthProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HealthProfile",
    },

    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    categories: {
      nutrition: {
        score: {
          type: Number,
          default: 0,
        },
        level: {
          type: String,
          default: "Unknown",
        },
      },

      physicalActivity: {
        score: {
          type: Number,
          default: 0,
        },
        level: {
          type: String,
          default: "Unknown",
        },
      },

      sleep: {
        score: {
          type: Number,
          default: 0,
        },
        level: {
          type: String,
          default: "Unknown",
        },
      },

      mentalWellbeing: {
        score: {
          type: Number,
          default: 0,
        },
        level: {
          type: String,
          default: "Unknown",
        },
      },

      substanceRisk: {
        score: {
          type: Number,
          default: 0,
        },
        level: {
          type: String,
          default: "Unknown",
        },
      },
    },

    priorityAreas: {
      type: [String],
      default: [],
    },

    recommendations: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "WellnessAssessment",
  wellnessAssessmentSchema
);