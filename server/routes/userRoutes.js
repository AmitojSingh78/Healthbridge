const express = require("express");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const { getProfile, updateProfile } = require("../controllers/userController");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.patch("/profile", protect, updateProfile);

router.get("/patient-test", protect, allowRoles("patient"), (req, res) => {
  res.json({ message: "Patient route accessed successfully", user: req.user });
});

router.get("/doctor-test", protect, allowRoles("doctor"), (req, res) => {
  res.json({ message: "Doctor route accessed successfully", user: req.user });
});

module.exports = router;
