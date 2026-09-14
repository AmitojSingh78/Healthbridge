const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    options: {
      type: [String],
      required: true,
    },

    correctAnswer: {
      type: Number,
      required: true,
    },
  },
  {
    _id: true,
  }
);


const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    estimatedMinutes: {
      type: Number,
      default: 5,
    },

    questions: {
      type: [questionSchema],
      default: [],
    },

    completed: {
      type: Boolean,
      default: false,
    },

    quizCompleted: {
      type: Boolean,
      default: false,
    },

    quizScore: {
      type: Number,
      default: 0,
    },

    progress: {
      type: Number,
      default: 0,
    },
  }
);


const moduleSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    priority: {
      type: String,

      enum: [
        "Low",
        "Medium",
        "High",
      ],

      default: "Medium",
    },

    lessons: {
      type: [lessonSchema],
      default: [],
    },

    completed: {
      type: Boolean,
      default: false,
    },

    progress: {
      type: Number,
      default: 0,
    },
  }
);


const learningPathSchema =
  new mongoose.Schema(
    {
      patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      assessment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WellnessAssessment",
      },

      modules: {
        type: [moduleSchema],
        default: [],
      },

      overallProgress: {
        type: Number,
        default: 0,
      },

      points: {
        type: Number,
        default: 0,
      },

      completedLessons: {
        type: Number,
        default: 0,
      },

      streak: {
        type: Number,
        default: 0,
      },
    },

    {
      timestamps: true,
    }
  );


module.exports = mongoose.model(
  "LearningPath",
  learningPathSchema
);