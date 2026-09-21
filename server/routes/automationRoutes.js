const express = require("express");
const router = express.Router();

const {
  getPatient,
  checkDoctorAvailability,
  procedure,
  getBedStatus,
  otAvailability,
  patientLabOrders,
  insuranceClaimStatus,
} = require("../controllers/automationController");

// Patient lookup
router.get("/patient/search", getPatient);

// Doctor availability check
router.get("/doctor/availability", checkDoctorAvailability);

// Procedure protocol lookup
router.get("/procedure/:code", procedure);

// Bed availability check
router.get("/beds/available", getBedStatus);

// Operation Theatre availability check
router.get("/ots/available", otAvailability);

// Patient lab orders check
router.get("/labs/patient/:patientId", patientLabOrders);

// Patient insurance claim status
router.get("/insurance/:patientId", insuranceClaimStatus);

module.exports = router;
