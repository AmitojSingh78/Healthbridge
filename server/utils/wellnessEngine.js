const getLevel = (score) => {

  if (score >= 80) {
    return "Excellent";
  }

  if (score >= 60) {
    return "Good";
  }

  if (score >= 40) {
    return "Needs Attention";
  }

  return "High Priority";
};

const calculateNutrition = (profile) => {

  let score = 50;


  if (
    profile.dietType === "Vegetarian" ||
    profile.dietType === "Vegan"
  ) {
    score += 15;
  }


  if (profile.waterIntake >= 2) {
    score += 20;
  } else if (profile.waterIntake >= 1.5) {
    score += 10;
  }


  return Math.min(score, 100);
};


const calculatePhysicalActivity = (
  profile
) => {

  switch (profile.exerciseFrequency) {

    case "5+ days":
      return 95;

    case "3-4 days":
      return 80;

    case "1-2 days":
      return 60;

    case "Never":
      return 25;

    default:
      return 40;
  }
};

const calculateSleep = (profile) => {

  const hours =
    Number(profile.sleepHours);


  if (!hours) {
    return 40;
  }


  if (hours >= 7 && hours <= 9) {
    return 95;
  }


  if (
    (hours >= 6 && hours < 7) ||
    (hours > 9 && hours <= 10)
  ) {
    return 70;
  }


  return 40;
};

const calculateMentalWellbeing =
  (profile) => {

    let score = 70;


    if (
      profile.stressLevel === "Low"
    ) {
      score += 20;
    }

    if (
      profile.stressLevel === "Moderate"
    ) {
      score += 5;
    }

    if (
      profile.stressLevel === "High"
    ) {
      score -= 25;
    }


    if (
      profile.mood === "Excellent"
    ) {
      score += 10;
    }

    if (
      profile.mood === "Good"
    ) {
      score += 5;
    }

    if (
      profile.mood === "Low" ||
      profile.mood === "Very Low"
    ) {
      score -= 15;
    }


    return Math.max(
      0,
      Math.min(score, 100)
    );
  };

const calculateSubstanceRisk =
  (profile) => {

    let score = 100;


    if (
      profile.smoking === "Occasionally"
    ) {
      score -= 20;
    }

    if (
      profile.smoking === "Regularly"
    ) {
      score -= 45;
    }


    if (
      profile.alcohol === "Occasionally"
    ) {
      score -= 10;
    }

    if (
      profile.alcohol === "Regularly"
    ) {
      score -= 30;
    }


    return Math.max(
      0,
      score
    );
  };


const calculateWellnessScore =
  (profile) => {

    const nutrition =
      calculateNutrition(profile);

    const physicalActivity =
      calculatePhysicalActivity(profile);

    const sleep =
      calculateSleep(profile);

    const mentalWellbeing =
      calculateMentalWellbeing(profile);

    const substanceRisk =
      calculateSubstanceRisk(profile);


    const overallScore = Math.round(
      (
        nutrition +
        physicalActivity +
        sleep +
        mentalWellbeing +
        substanceRisk
      ) / 5
    );


    const categories = {

      nutrition: {
        score: nutrition,
        level: getLevel(nutrition),
      },

      physicalActivity: {
        score: physicalActivity,
        level: getLevel(
          physicalActivity
        ),
      },

      sleep: {
        score: sleep,
        level: getLevel(sleep),
      },

      mentalWellbeing: {
        score: mentalWellbeing,
        level: getLevel(
          mentalWellbeing
        ),
      },

      substanceRisk: {
        score: substanceRisk,
        level: getLevel(
          substanceRisk
        ),
      },

    };

    const priorityAreas = [];


    Object.entries(categories)
      .forEach(
        ([category, data]) => {

          if (data.score < 60) {

            priorityAreas.push(
              category
            );

          }

        }
      );



    const recommendations = [];


    if (nutrition < 60) {

      recommendations.push(
        "Learn about balanced nutrition and healthy hydration."
      );

    }


    if (physicalActivity < 60) {

      recommendations.push(
        "Gradually increase regular physical activity."
      );

    }


    if (sleep < 60) {

      recommendations.push(
        "Learn about sleep hygiene and build a consistent sleep routine."
      );

    }


    if (mentalWellbeing < 60) {

      recommendations.push(
        "Explore stress-management and emotional well-being techniques."
      );

    }


    if (substanceRisk < 60) {

      recommendations.push(
        "Consider learning about the long-term health effects of tobacco and alcohol."
      );

    }


    return {

      overallScore,

      categories,

      priorityAreas,

      recommendations,

    };

  };


module.exports = {
  calculateWellnessScore,
};