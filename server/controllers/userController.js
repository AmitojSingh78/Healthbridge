const User = require("../models/User");

exports.getProfile = async (req, res) => {
	res.json({
		message: "Profile accessed successfully",
		user: req.user,
	});
};

exports.updateProfile = async (req, res) => {
	try {
		const allowedFields = [
			"name",
			"phone",
			"dateOfBirth",
			"gender",
			"specialization",
			"experience",
			"medicalRegistrationNumber",
			"hospital",
		];

		const updates = {};

		allowedFields.forEach((field) => {
			if (req.body[field] !== undefined) {
				updates[field] = req.body[field];
			}
		});

		const user = await User.findByIdAndUpdate(req.user._id, updates, {
			new: true,
			runValidators: true,
		}).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json({
			message: "Profile updated successfully",
			user,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Failed to update profile",
			error: error.message,
		});
	}
};
