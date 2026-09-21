const mongoose = require("mongoose");

const agentRunSchema = new mongoose.Schema(
  {
    
    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    
    userRequest: {
      type: String,
      required: true,
      trim: true,
    },

    
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    procedureCode: {
      type: String,
      default: null,
    },

    requestedDate: {
      type: Date,
      default: null,
    },

    
    currentStep: {
      type: String,
      enum: [
        "started",
        "planning",
        "patient_lookup",
        "doctor_check",
        "procedure_check",
        "bed_check",
        "ot_check",
        "lab_check",
        "insurance_check",
        "generating_plan",
        "awaiting_approval",
        "executing",
        "completed",
        "rejected",
        "failed",
      ],
      default: "started",
    },

    
    status: {
      type: String,
      enum: [
        "running",
        "awaiting_approval",
        "approved",
        "rejected",
        "completed",
        "failed",
      ],
      default: "running",
    },

    
    plan: {
      patientName: {
        type: String,
        default: null,
      },

      doctorName: {
        type: String,
        default: null,
      },

      procedure: {
        type: String,
        default: null,
      },

      admissionDate: {
        type: Date,
        default: null,
      },

      selectedBed: {
        bedId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Bed",
          default: null,
        },

        bedNumber: {
          type: String,
          default: null,
        },

        ward: {
          type: String,
          default: null,
        },
      },

      selectedOT: {
        otId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "OperationTheatre",
          default: null,
        },

        name: {
          type: String,
          default: null,
        },

        startTime: {
          type: String,
          default: null,
        },

        endTime: {
          type: String,
          default: null,
        },
      },

      requiredTests: {
        type: [String],
        default: [],
      },

      completedTests: {
        type: [String],
        default: [],
      },

      missingTests: {
        type: [String],
        default: [],
      },

      insurance: {
        provider: {
          type: String,
          default: null,
        },

        active: {
          type: Boolean,
          default: null,
        },

        coverageAmount: {
          type: Number,
          default: null,
        },

        preAuthorizationRequired: {
          type: Boolean,
          default: null,
        },

        preAuthorizationStatus: {
          type: String,
          default: null,
        },
      },
    },

    
    approval: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },

      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      approvedAt: {
        type: Date,
        default: null,
      },

      rejectionReason: {
        type: String,
        default: null,
      },
    },

    
    logs: [
      {
        step: {
          type: String,
          required: true,
        },

        message: {
          type: String,
          required: true,
        },

        status: {
          type: String,
          enum: ["pending", "running", "success", "failed"],
          default: "pending",
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    
    errors: [
      {
        step: {
          type: String,
          default: null,
        },

        message: {
          type: String,
          required: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    
    admission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admission",
      default: null,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const AgentRun = mongoose.model("AgentRun", agentRunSchema);
module.exports = AgentRun;



