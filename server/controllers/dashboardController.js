const User = require("../models/User");
const WellnessAssessment = require("../models/WellnessAssessment");
const LearningPath = require("../models/LearningPath");
const Appointment = require("../models/Appointment");
const AIConversation = require("../models/AIConversation");

exports.getPatientDashboard = async (req, res) => {
	try {
		const patientId = req.user._id;

		const patient = await User.findById(patientId).select(
			"name email role profileImage",
		);

		const latestAssessment = await WellnessAssessment.findOne({
			patient: patientId,
		}).sort({
			createdAt: -1,
		});

		const assessments = await WellnessAssessment.find({
			patient: patientId,
		})
			.sort({
				createdAt: 1,
			})
			.select("overallScore categories createdAt");

		const learningPath = await LearningPath.findOne({
			patient: patientId,
		}).sort({
			createdAt: -1,
		});

		const allAppointments = await Appointment.find({
			patient: patientId,
		})
			.populate("doctor", "name specialization profileImage")
			.sort({
				createdAt: -1,
			})
			.limit(20);

		const today = new Date();

		today.setHours(0, 0, 0, 0);

		const upcomingAppointments = allAppointments
			.filter((appointment) => {
				const appointmentDate = new Date(appointment.date);

				return (
					!Number.isNaN(appointmentDate.getTime()) &&
					appointmentDate >= today &&
					["pending", "confirmed"].includes(appointment.status)
				);
			})
			.sort((a, b) => {
				return new Date(a.date) - new Date(b.date);
			})
			.slice(0, 5);

		const aiConversations = await AIConversation.find({
			patient: patientId,
		})
			.sort({
				createdAt: -1,
			})
			.limit(5)
			.select("messages requiresDoctor createdAt");

		res.json({
			patient,

			wellness: {
				latest: latestAssessment,

				history: assessments,
			},

			learning: {
				path: learningPath,
			},

			appointments: upcomingAppointments,

			aiConversations,
		});
	} catch (error) {
		console.error("Dashboard error:", error);

		res.status(500).json({
			message: "Unable to load dashboard",
		});
	}
};
