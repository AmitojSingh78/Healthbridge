const mongoose = require("mongoose");

const healthProfileSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        height: {
            type: Number,
        },

        weight: {
            type: Number,
        },

        bloodGroup: {
            type: String,
            enum: [
                "A+",
                "A-",
                "B+",
                "B-",
                "AB+",
                "AB-",
                "O+",
                "O-",
                "Unknown",
            ],
        },

        exerciseFrequency: {
            type: String,
            enum: [
                "Never",
                "1-2 days",
                "3-4 days",
                "5+ days",
            ],
        },

        sleepHours: {
            type: Number,
        },

        waterIntake: {
            type: Number,
        },

        dietType: {
            type: String,
            enum: [
                "Vegetarian",
                "Non-Vegetarian",
                "Vegan",
                "Other",
            ],
        },

        smoking: {
            type: String,
            enum: [
                "Never",
                "Occasionally",
                "Regularly",
            ],
        },

        alcohol: {
            type: String,
            enum: [
                "Never",
                "Occasionally",
                "Regularly",
            ],
        },

        existingConditions: {
            type: [String],
            default: [],
        },

        allergies: {
            type: [String],
            default: [],
        },

        currentMedications: {
            type: [String],
            default: [],
        },

        previousSurgeries: {
            type: [String],
            default: [],
        },

        familyMedicalHistory: {
            type: [String],
            default: [],
        },

        stressLevel: {
            type: String,
            enum: [
                "Low",
                "Moderate",
                "High",
            ],
        },

        mood: {
            type: String,
            enum: [
                "Excellent",
                "Good",
                "Okay",
                "Low",
                "Very Low",
            ],
        },
        existingConditions: {
            type: [String],
            default: [],
        },

        allergies: {
            type: [String],
            default: [],
        },

        currentMedications: {
            type: [String],
            default: [],
        },

        previousSurgeries: {
            type: [String],
            default: [],
        },

        familyMedicalHistory: {
            type: [String],
            default: [],
        },

        profileCompletion: {
            type: Number,
            default: 0,
        },
    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "HealthProfile",
    healthProfileSchema
);