const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const allowRoles =
  require("../middleware/roleMiddleware");

const {
  runAssessment,
  getLatestAssessment,
} = require(
  "../controllers/wellnessController"
);


router.post(
  "/assessment",
  protect,
  allowRoles("patient"),
  runAssessment
);


router.get(
  "/assessment/latest",
  protect,
  allowRoles("patient"),
  getLatestAssessment
);


module.exports = router;