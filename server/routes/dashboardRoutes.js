const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const allowRoles =
  require("../middleware/roleMiddleware");

const {
  getPatientDashboard,
} = require(
  "../controllers/dashboardController"
);


router.get(
  "/patient",
  protect,
  allowRoles("patient"),
  getPatientDashboard
);


module.exports = router;