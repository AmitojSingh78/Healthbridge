const Appointment = require("../models/Appointment");
const User = require("../models/User");

exports.bookAppointment = async (req, res) => {
	try {
		const { doctor, date, time, reason, patientNotes } = req.body;

		if (!doctor || !date || !time || !reason) {
			return res.status(400).json({
				message: "Doctor, date, time and reason are required",
			});
		}

		const doctorUser = await User.findOne({
			_id: doctor,
			role: "doctor",
		});

		if (!doctorUser) {
			return res.status(404).json({
				message: "Doctor not found",
			});
		}

		const existingAppointment = await Appointment.findOne({
			doctor,
			date,
			time,
			status: {
				$in: ["pending", "confirmed"],
			},
		});

		if (existingAppointment) {
			return res.status(409).json({
				message: "This time slot is already booked",
			});
		}

		const appointment = await Appointment.create({
			patient: req.user._id,

			doctor,

			date,

			time,

			reason,

			patientNotes: patientNotes || "",
		});

		const populatedAppointment = await Appointment.findById(appointment._id)
			.populate("doctor", "name specialization hospital experience")
			.populate("patient", "name email");

		res.status(201).json({
			message: "Appointment booked successfully",

			appointment: populatedAppointment,
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			message: "Failed to book appointment",
			error: error.message,
		});
	}
};

exports.getPatientAppointments = async (req, res) => {
	try {
		const appointments = await Appointment.find({
			patient: req.user._id,
		})
			.populate("doctor", "name specialization hospital experience")
			.sort({
				date: 1,
				time: 1,
			});

		res.json({
			appointments,
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			message: "Failed to fetch appointments",
		});
	}
};

exports.getDoctorAppointments = async (req, res) => {
	try {
		const appointments = await Appointment.find({
			doctor: req.user._id,
		})
			.populate("patient", "name email phone")
			.sort({
				date: 1,
				time: 1,
			});

		res.json({
			appointments,
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			message: "Failed to fetch appointments",
		});
	}
};

exports.updateAppointmentStatus = async (req, res) => {
	try {
		const { status, doctorNotes } = req.body;

		const allowedStatuses = ["confirmed", "rejected", "completed"];

		if (!allowedStatuses.includes(status)) {
			return res.status(400).json({
				message: "Invalid appointment status",
			});
		}

		const appointment = await Appointment.findOne({
			_id: req.params.id,

			doctor: req.user._id,
		});

		if (!appointment) {
			return res.status(404).json({
				message: "Appointment not found",
			});
		}

		appointment.status = status;

		if (doctorNotes !== undefined) {
			appointment.doctorNotes = doctorNotes;
		}

		await appointment.save();

		const populatedAppointment = await Appointment.findById(appointment._id)
			.populate("patient", "name email phone")
			.populate("doctor", "name specialization hospital");

		res.json({
			message: "Appointment updated successfully",

			appointment: populatedAppointment,
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			message: "Failed to update appointment",
		});
	}
};

exports.cancelAppointment = async (req, res) => {
	try {
		const appointment = await Appointment.findOne({
			_id: req.params.id,
			patient: req.user._id,
		});

		if (!appointment) {
			return res.status(404).json({
				message: "Appointment not found",
			});
		}

		if (appointment.status === "completed") {
			return res.status(400).json({
				message: "Completed appointment cannot be cancelled",
			});
		}

		appointment.status = "cancelled";

		await appointment.save();

		res.json({
			message: "Appointment cancelled successfully",

			appointment,
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			message: "Failed to cancel appointment",
		});
	}
};
