const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const allowRoles = require("../middleware/roleMiddleware");

const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} = require(
  "../controllers/appointmentController"
);


router.post(
  "/",
  protect,
  allowRoles("patient"),
  bookAppointment
);

router.get(
  "/patient",
  protect,
  allowRoles("patient"),
  getPatientAppointments
);

router.patch(
  "/:id/cancel",
  protect,
  allowRoles("patient"),
  cancelAppointment
);


router.get(
  "/doctor",
  protect,
  allowRoles("doctor"),
  getDoctorAppointments
);


router.patch(
  "/:id/status",
  protect,
  allowRoles("doctor"),
  updateAppointmentStatus
);


module.exports = router;