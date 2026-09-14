const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const allowRoles = require("../middleware/roleMiddleware");

const {
  getHealthProfile,
  saveHealthProfile,
} = require("../controllers/healthController");


router.get(
  "/profile",
  protect,
  allowRoles("patient"),
  getHealthProfile
);


router.post(
  "/profile",
  protect,
  allowRoles("patient"),
  saveHealthProfile
);


module.exports = router;