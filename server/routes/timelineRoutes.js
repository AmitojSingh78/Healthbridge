const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const allowRoles =
  require("../middleware/roleMiddleware");

const {
  getHealthTimeline,
} = require(
  "../controllers/timelineController"
);


router.get(
  "/",
  protect,
  allowRoles("patient"),
  getHealthTimeline
);


module.exports = router;