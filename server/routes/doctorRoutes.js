const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const allowRoles = require("../middleware/roleMiddleware");

const {
  getDoctors,
  getDoctor,
  getMyPatients,
  getMyStats,
} = require("../controllers/doctorController");

router.get("/me/patients", protect, allowRoles("doctor"), getMyPatients);
router.get("/me/stats", protect, allowRoles("doctor"), getMyStats);

router.get("/", protect, allowRoles("patient"), getDoctors);

router.get("/:id", protect, allowRoles("patient"), getDoctor);

module.exports = router;
