const HealthProfile = require("../models/HealthProfile");

exports.getHealthProfile = async (req, res) => {
	try {
		const profile = await HealthProfile.findOne({
			patient: req.user._id,
		});

		if (!profile) {
			return res.status(404).json({
				message: "Health profile not found",
			});
		}

		res.json(profile);
	} catch (error) {
		console.error(error);

		res.status(500).json({
			message: "Failed to fetch health profile",
		});
	}
};

exports.saveHealthProfile = async (req, res) => {
	try {
		const patientId = req.user._id;

		const data = req.body;

		const fields = [
			"height",
			"weight",
			"bloodGroup",
			"exerciseFrequency",
			"sleepHours",
			"waterIntake",
			"dietType",
			"smoking",
			"alcohol",
			"stressLevel",
			"mood",
		];

		let completedFields = 0;

		fields.forEach((field) => {
			const value = data[field];

			if (value !== undefined && value !== null && value !== "") {
				completedFields++;
			}
		});

		const profileCompletion = Math.round(
			(completedFields / fields.length) * 100,
		);

		data.profileCompletion = profileCompletion;

		let profile = await HealthProfile.findOne({
			patient: patientId,
		});

		if (!profile) {
			profile = await HealthProfile.create({
				patient: patientId,
				...data,
			});
		} else {
			Object.assign(profile, data);

			await profile.save();
		}

		res.json({
			message: "Health profile saved successfully",
			profile,
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			message: "Failed to save health profile",
			error: error.message,
		});
	}
};
