const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const User = require("./models/User");
const HealthProfile = require("./models/HealthProfile");
const WellnessAssessment = require("./models/WellnessAssessment");
const LearningPath = require("./models/LearningPath");
const Appointment = require("./models/Appointment");

const { calculateWellnessScore } = require("./utils/wellnessEngine");
const { generateLearningPath } = require("./utils/learningPathGenerator");

const DEMO_PASSWORD = "Password123!";

const DOCTORS = [
  {
    name: "Ananya Rao",
    email: "dr.ananya@healthbridge.demo",
    specialization: "Cardiologist",
    experience: 12,
    hospital: "Sunrise Heart Institute",
    medicalRegistrationNumber: "MED-10234",
    phone: "+91 90000 10001",
    gender: "female",
  },
  {
    name: "Rahul Mehta",
    email: "dr.rahul@healthbridge.demo",
    specialization: "General Physician",
    experience: 8,
    hospital: "City Care Clinic",
    medicalRegistrationNumber: "MED-10235",
    phone: "+91 90000 10002",
    gender: "male",
  },
  {
    name: "Priya Nair",
    email: "dr.priya@healthbridge.demo",
    specialization: "Dermatologist",
    experience: 6,
    hospital: "Glow Skin & Wellness",
    medicalRegistrationNumber: "MED-10236",
    phone: "+91 90000 10003",
    gender: "female",
  },
  {
    name: "Vikram Singh",
    email: "dr.vikram@healthbridge.demo",
    specialization: "Orthopedic",
    experience: 15,
    hospital: "Metro Bone & Joint Center",
    medicalRegistrationNumber: "MED-10237",
    phone: "+91 90000 10004",
    gender: "male",
  },
];

const PATIENT = {
  name: "Aditi Sharma",
  email: "patient@healthbridge.demo",
  phone: "+91 90000 20001",
  gender: "female",
  dateOfBirth: new Date("1996-04-12"),
};

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB for seeding.");

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
  const createdDoctors = [];

  for (const doc of DOCTORS) {
    const doctor = await User.findOneAndUpdate(
      { email: doc.email },
      { ...doc, password: hashedPassword, role: "doctor" },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    createdDoctors.push(doctor);
  }

  console.log(`Seeded ${createdDoctors.length} demo doctors.`);
  const patient = await User.findOneAndUpdate(
    { email: PATIENT.email },
    { ...PATIENT, password: hashedPassword, role: "patient" },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log("Seeded demo patient.");
  const healthProfileData = {
    height: 165,
    weight: 62,
    bloodGroup: "O+",
    exerciseFrequency: "1-2 days",
    sleepHours: 6,
    waterIntake: 1.5,
    dietType: "Vegetarian",
    smoking: "Never",
    alcohol: "Occasionally",
    existingConditions: [],
    allergies: ["Pollen"],
    currentMedications: [],
    stressLevel: "Moderate",
    mood: "Good",
    profileCompletion: 100,
  };

  const healthProfile = await HealthProfile.findOneAndUpdate(
    { patient: patient._id },
    { patient: patient._id, ...healthProfileData },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log("Seeded demo health profile.");

  const result = calculateWellnessScore(healthProfile);

  let assessment = await WellnessAssessment.findOne({ patient: patient._id });
  if (!assessment) {
    assessment = await WellnessAssessment.create({
      patient: patient._id,
      healthProfile: healthProfile._id,
      overallScore: result.overallScore,
      categories: result.categories,
      priorityAreas: result.priorityAreas,
      recommendations: result.recommendations,
    });
  }

  console.log("Seeded demo wellness assessment.");

  const existingPath = await LearningPath.findOne({ patient: patient._id });
  if (!existingPath) {
    const modules = generateLearningPath(assessment);
    await LearningPath.create({
      patient: patient._id,
      assessment: assessment._id,
      modules,
      overallProgress: 0,
    });
  }

  console.log("Seeded demo learning path.");

  const today = new Date();
  const inThreeDays = new Date(today);
  inThreeDays.setDate(today.getDate() + 3);
  const inSevenDays = new Date(today);
  inSevenDays.setDate(today.getDate() + 7);
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const fmt = (d) => d.toISOString().split("T")[0];

  const appointmentsSeed = [
    {
      patient: patient._id,
      doctor: createdDoctors[0]._id,
      date: fmt(inThreeDays),
      time: "10:00 AM",
      reason: "Follow-up on blood pressure readings",
      status: "confirmed",
    },
    {
      patient: patient._id,
      doctor: createdDoctors[1]._id,
      date: fmt(inSevenDays),
      time: "02:00 PM",
      reason: "General wellness check-up",
      status: "pending",
    },
    {
      patient: patient._id,
      doctor: createdDoctors[2]._id,
      date: fmt(lastWeek),
      time: "11:00 AM",
      reason: "Skin rash consultation",
      status: "completed",
      doctorNotes: "Mild contact dermatitis. Prescribed topical cream, advised to avoid known allergen.",
    },
  ];

  for (const appt of appointmentsSeed) {
    await Appointment.findOneAndUpdate(
      { patient: appt.patient, doctor: appt.doctor, date: appt.date, time: appt.time },
      appt,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log("Seeded demo appointments.");

  console.log("\n================================");
  console.log("Seed complete! Demo credentials:");
  console.log("================================");
  console.log(`Patient login  -> ${PATIENT.email} / ${DEMO_PASSWORD}`);
  DOCTORS.forEach((d) => console.log(`Doctor login   -> ${d.email} / ${DEMO_PASSWORD}`));
  console.log("================================\n");

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
