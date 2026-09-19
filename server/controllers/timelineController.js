const WellnessAssessment = require("../models/WellnessAssessment");

const LearningPath = require("../models/LearningPath");

const Appointment = require("../models/Appointment");

const AIConversation = require("../models/AIConversation");

exports.getHealthTimeline = async (req, res) => {
	try {
		const patientId = req.user._id;

		const timeline = [];

		const assessments = await WellnessAssessment.find({
			patient: patientId,
		});

		assessments.forEach((assessment) => {
			timeline.push({
				type: "wellness",

				title: "Wellness Assessment",

				description: `Wellness score: ${assessment.overallScore}/100`,

				date: assessment.createdAt,
			});
		});

		const appointments = await Appointment.find({
			patient: patientId,
		}).populate("doctor", "name specialization");

		appointments.forEach((appointment) => {
			timeline.push({
				type: "appointment",

				title: "Doctor Appointment",

				description: `Appointment with Dr. ${
					appointment.doctor?.name || "Doctor"
				}`,

				date: appointment.date,

				status: appointment.status,
			});
		});

		const conversations = await AIConversation.find({
			patient: patientId,
		});

		conversations.forEach((conversation) => {
			timeline.push({
				type: "ai",

				title: "AI Health Assistant",

				description: conversation.requiresDoctor
					? "AI session recommended professional consultation"
					: "Health discussion with AI assistant",

				date: conversation.createdAt,
			});
		});

		const learning = await LearningPath.findOne({
			patient: patientId,
		});

		if (learning) {
			learning.modules.forEach((module) => {
				module.lessons.forEach((lesson) => {
					if (lesson.completed) {
						timeline.push({
							type: "learning",

							title: "Learning Completed",

							description: `${lesson.title} completed`,

							date: lesson.updatedAt || learning.updatedAt,
						});
					}
				});
			});
		}

		timeline.sort((a, b) => new Date(b.date) - new Date(a.date));

		res.json({
			timeline,
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			message: "Unable to load health timeline",
		});
	}
};
