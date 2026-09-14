const mongoose = require("mongoose");

const aiConversationSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },

        content: {
          type: String,
          required: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    consultationSummary: {
      concern: {
        type: String,
        default: "",
      },

      symptoms: {
        type: [String],
        default: [],
      },

      duration: {
        type: String,
        default: "",
      },

      severity: {
        type: String,
        default: "",
      },

      additionalInformation: {
        type: String,
        default: "",
      },
    },

    requiresDoctor: {
      type: Boolean,
      default: false,
    },

    redFlags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AIConversation",
  aiConversationSchema
);