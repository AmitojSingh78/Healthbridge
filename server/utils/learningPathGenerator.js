const learningContent =
  require("../data/learningContent");


const createModule = (
  category,
  title,
  description,
  priority
) => {

  const content =
    learningContent[category] || [];


  return {

    category,

    title,

    description,

    priority,

    lessons: content,

    progress: 0,

    completed: false,

  };

};


const generateLearningPath =
  (assessment) => {

    const modules = [];

    if (
      assessment.categories
        .nutrition.score < 80
    ) {

      modules.push(

        createModule(

          "Nutrition",

          "Improve Your Nutrition Knowledge",

          "Learn practical concepts about balanced nutrition and hydration.",

          assessment.categories
            .nutrition.score < 60
            ? "High"
            : "Medium"

        )

      );

    }

    if (
      assessment.categories
        .physicalActivity.score < 80
    ) {

      modules.push(

        createModule(

          "Physical Activity",

          "Build an Active Lifestyle",

          "Learn how regular movement can support overall well-being.",

          assessment.categories
            .physicalActivity.score < 60
            ? "High"
            : "Medium"

        )

      );

    }

    if (
      assessment.categories
        .sleep.score < 80
    ) {

      modules.push(

        createModule(

          "Sleep",

          "Improve Your Sleep Habits",

          "Learn practical strategies for maintaining healthy sleep habits.",

          assessment.categories
            .sleep.score < 60
            ? "High"
            : "Medium"

        )

      );

    }

    if (
      assessment.categories
        .mentalWellbeing.score < 80
    ) {

      modules.push(

        createModule(

          "Mental Well-being",

          "Build Stress Awareness",

          "Learn about everyday stress and healthy coping strategies.",

          assessment.categories
            .mentalWellbeing.score < 60
            ? "High"
            : "Medium"

        )

      );

    }

    if (
      assessment.categories
        .substanceRisk.score < 80
    ) {

      modules.push(

        createModule(

          "Health Awareness",

          "Understand Lifestyle Health Risks",

          "Learn about tobacco, alcohol and informed health decisions.",

          assessment.categories
            .substanceRisk.score < 60
            ? "High"
            : "Medium"

        )

      );

    }


    return modules;
  };


module.exports = {
  generateLearningPath,
};