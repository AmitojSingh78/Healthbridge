const HealthProfile = require("../models/HealthProfile");

const WellnessAssessment = require("../models/WellnessAssessment");

const { calculateWellnessScore } = require("../utils/wellnessEngine");

exports.runAssessment = async (req, res) => {
	try {
		const profile = await HealthProfile.findOne({
			patient: req.user._id,
		});

		if (!profile) {
			return res.status(404).json({
				message: "Please complete your health profile first.",
			});
		}

		const result = calculateWellnessScore(profile);

		const assessment = await WellnessAssessment.create({
			patient: req.user._id,

			healthProfile: profile._id,

			overallScore: result.overallScore,

			categories: result.categories,

			priorityAreas: result.priorityAreas,

			recommendations: result.recommendations,
		});

		res.status(201).json({
			message: "Wellness assessment completed",

			assessment,
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			message: "Failed to generate wellness assessment",

			error: error.message,
		});
	}
};

exports.getLatestAssessment = async (req, res) => {
	try {
		const assessment = await WellnessAssessment.findOne({
			patient: req.user._id,
		}).sort({
			createdAt: -1,
		});

		if (!assessment) {
			return res.status(404).json({
				message: "No wellness assessment found",
			});
		}

		res.json({
			assessment,
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			message: "Failed to fetch assessment",
		});
	}
};
