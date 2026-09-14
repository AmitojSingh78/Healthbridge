const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const protect = authMiddleware.protect || authMiddleware;

const roleMiddleware = require("../middleware/roleMiddleware");
const allowRoles = roleMiddleware.allowRoles || roleMiddleware;
const {
  generateLearningPath,
  getLearningPath,
  updateModuleProgress,
  submitQuiz,
  getLibrary,
} = require("../controllers/learningController");

router.get("/library", protect, allowRoles("patient"), getLibrary);

router.post(
  "/:id/module/:moduleId/lesson/:lessonId/quiz",
  protect,
  allowRoles("patient"),
  submitQuiz
);

router.post(
  "/generate",
  protect,
  allowRoles("patient"),
  generateLearningPath
);

router.get(
  "/",
  protect,
  allowRoles("patient"),
  getLearningPath
);

router.patch(
  "/:id/module/:moduleId",
  protect,
  allowRoles("patient"),
  updateModuleProgress
);

module.exports = router;