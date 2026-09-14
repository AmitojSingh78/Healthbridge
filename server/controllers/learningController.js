const WellnessAssessment = require("../models/WellnessAssessment");
const LearningPath = require("../models/LearningPath");
const { generateLearningPath } = require("../utils/learningPathGenerator");
const learningContent = require("../data/learningContent");

exports.getLibrary = async (req, res) => {
  try {
    res.json({ library: learningContent });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch education library",
    });
  }
};

exports.generateLearningPath = async (req, res) => {
  try {
    const assessment = await WellnessAssessment.findOne({
      patient: req.user._id,
    }).sort({ createdAt: -1 });

    if (!assessment) {
      return res.status(404).json({
        message: "Complete a wellness assessment first.",
      });
    }

    const modules = generateLearningPath(assessment);

    const learningPath = await LearningPath.create({
      patient: req.user._id,
      assessment: assessment._id,
      modules,
      overallProgress: 0,
    });

    res.status(201).json({
      message: "Learning path generated",
      learningPath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to generate learning path",
    });
  }
};

exports.getLearningPath = async (req, res) => {
  try {
    const path = await LearningPath.findOne({
      patient: req.user._id,
    }).sort({ createdAt: -1 });

    if (!path) {
      return res.status(404).json({
        message: "No learning path found",
      });
    }

    res.json({
      learningPath: path,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch learning path",
    });
  }
};

exports.updateModuleProgress = async (req, res) => {
  try {
    const { progress } = req.body;

    const path = await LearningPath.findOne({
      _id: req.params.id,
      patient: req.user._id,
    });

    if (!path) {
      return res.status(404).json({
        message: "Learning path not found",
      });
    }

    const module = path.modules.id(req.params.moduleId);

    if (!module) {
      return res.status(404).json({
        message: "Module not found",
      });
    }

    module.progress = Math.max(0, Math.min(Number(progress), 100));
    module.completed = module.progress === 100;

    const totalProgress = path.modules.reduce(
      (sum, item) => sum + item.progress,
      0
    );

    path.overallProgress = path.modules.length
      ? Math.round(totalProgress / path.modules.length)
      : 0;

    await path.save();

    res.json({
      message: "Learning progress updated",
      learningPath: path,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update progress",
    });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        message: "Answers must be an array",
      });
    }

    const path = await LearningPath.findOne({
      _id: req.params.id,
      patient: req.user._id,
    });

    if (!path) {
      return res.status(404).json({
        message: "Learning path not found",
      });
    }

    const module = path.modules.id(req.params.moduleId);

    if (!module) {
      return res.status(404).json({
        message: "Module not found",
      });
    }

    const lesson = module.lessons.id(req.params.lessonId);

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    let correct = 0;

    lesson.questions.forEach((question, index) => {
      if (Number(answers[index]) === question.correctAnswer) {
        correct++;
      }
    });

    const total = lesson.questions.length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;

    lesson.quizScore = score;
    lesson.quizCompleted = true;
    lesson.completed = true;
    lesson.progress = 100;

    const totalLessonProgress = module.lessons.reduce(
      (sum, item) => sum + item.progress,
      0
    );

    module.progress = module.lessons.length
      ? Math.round(totalLessonProgress / module.lessons.length)
      : 0;

    module.completed = module.progress === 100;

    const totalModuleProgress = path.modules.reduce(
      (sum, item) => sum + item.progress,
      0
    );

    path.overallProgress = path.modules.length
      ? Math.round(totalModuleProgress / path.modules.length)
      : 0;

    let completedLessons = 0;
    path.modules.forEach((item) => {
      item.lessons.forEach((lessonItem) => {
        if (lessonItem.completed) {
          completedLessons++;
        }
      });
    });

    path.completedLessons = completedLessons;

    path.points = (path.points || 0) + (score >= 70 ? 10 : 5);

    await path.save();

    res.json({
      message: "Quiz submitted successfully",
      score,
      correct,
      total,
      points: path.points,
      learningPath: path,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to submit quiz",
    });
  }
};