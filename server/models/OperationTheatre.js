const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      // format: YYYY-MM-DD
    },

    startTime: {
      type: String,
      required: true,
      // format: HH:mm
    },

    endTime: {
      type: String,
      required: true,
      // format: HH:mm
    },

    status: {
      type: String,
      enum: ["available", "reserved", "occupied"],
      default: "available",
    },

    reservedFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    _id: true,
  }
);

const operationTheatreSchema = new mongoose.Schema(
  {
    OTName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    supportedProcedures: {
      type: [String],
      default: [],
    },

    slots: {
      type: [slotSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "OperationTheatre",
  operationTheatreSchema
);