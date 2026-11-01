const express = require("express");
const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const { generatePlan } = require("../controllers/dietPlannerController");

const router = express.Router();
router.post("/generate", protect, allowRoles("patient"), generatePlan);

module.exports = router;
