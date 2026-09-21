const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

// =========================
// EXISTING MODELS
// =========================

const User = require("./models/User");
const HealthProfile = require("./models/HealthProfile");
const WellnessAssessment = require("./models/WellnessAssessment");
const LearningPath = require("./models/LearningPath");
const Appointment = require("./models/Appointment");

// =========================
// NEW HOSPITAL MODELS
// =========================

const Bed = require("./models/Bed");
const OperationTheatre = require("./models/OperationTheatre");
const ProcedureProtocol = require("./models/ProcedureProtocol");
const LabOrder = require("./models/LabOrder");
const Insurance = require("./models/Insurance");

// =========================
// UTILITIES
// =========================

const { calculateWellnessScore } = require("./utils/wellnessEngine");

const { generateLearningPath } = require("./utils/learningPathGenerator");

// =========================
// DEMO PASSWORD
// =========================

const DEMO_PASSWORD = "Password123!";

// =========================
// DEMO DOCTORS
// =========================

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

// =========================
// DEMO PATIENT
// =========================

const PATIENT = {
  name: "Aditi Sharma",
  email: "patient@healthbridge.demo",
  phone: "+91 90000 20001",
  gender: "female",
  dateOfBirth: new Date("1996-04-12"),
};

// =========================
// SEED FUNCTION
// =========================

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  console.log("Connected to MongoDB for seeding.");

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  // =========================================================
  // SEED DOCTORS
  // =========================================================

  const createdDoctors = [];

  for (const doc of DOCTORS) {
    const doctor = await User.findOneAndUpdate(
      {
        email: doc.email,
      },

      {
        ...doc,
        password: hashedPassword,
        role: "doctor",
      },

      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    createdDoctors.push(doctor);
  }

  console.log(`Seeded ${createdDoctors.length} demo doctors.`);

  // =========================================================
  // SEED PATIENT
  // =========================================================

  const patient = await User.findOneAndUpdate(
    {
      email: PATIENT.email,
    },

    {
      ...PATIENT,
      password: hashedPassword,
      role: "patient",
    },

    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  console.log("Seeded demo patient.");

  // =========================================================
  // HEALTH PROFILE
  // =========================================================

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
    {
      patient: patient._id,
    },

    {
      patient: patient._id,
      ...healthProfileData,
    },

    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  console.log("Seeded demo health profile.");

  // =========================================================
  // WELLNESS ASSESSMENT
  // =========================================================

  const result = calculateWellnessScore(healthProfile);

  let assessment = await WellnessAssessment.findOne({
    patient: patient._id,
  });

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

  // =========================================================
  // LEARNING PATH
  // =========================================================

  const existingPath = await LearningPath.findOne({
    patient: patient._id,
  });

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

  // =========================================================
  // DATE HELPERS
  // =========================================================

  const today = new Date();

  const tomorrow = new Date(today);

  tomorrow.setDate(today.getDate() + 1);

  const inThreeDays = new Date(today);

  inThreeDays.setDate(today.getDate() + 3);

  const inSevenDays = new Date(today);

  inSevenDays.setDate(today.getDate() + 7);

  const lastWeek = new Date(today);

  lastWeek.setDate(today.getDate() - 7);

  const fmt = (d) => d.toISOString().split("T")[0];

  // =========================================================
  // APPOINTMENTS
  // =========================================================

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

      doctorNotes:
        "Mild contact dermatitis. Prescribed topical cream, advised to avoid known allergen.",
    },
  ];

  for (const appt of appointmentsSeed) {
    await Appointment.findOneAndUpdate(
      {
        patient: appt.patient,

        doctor: appt.doctor,

        date: appt.date,

        time: appt.time,
      },

      appt,

      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  console.log("Seeded demo appointments.");

  // =========================================================
  // HOSPITAL BEDS
  // =========================================================

  const bedsSeed = [
    {
      bedNumber: "ORTHO-01",
      ward: "orthopedic",
      status: "available",
      currentPatient: null,
    },

    {
      bedNumber: "ORTHO-02",
      ward: "orthopedic",
      status: "occupied",
      currentPatient: null,
    },

    {
      bedNumber: "ORTHO-03",
      ward: "orthopedic",
      status: "available",
      currentPatient: null,
    },

    {
      bedNumber: "ICU-01",
      ward: "icu",
      status: "available",
      currentPatient: null,
    },

    {
      bedNumber: "ICU-02",
      ward: "icu",
      status: "occupied",
      currentPatient: null,
    },

    {
      bedNumber: "GENERAL-01",
      ward: "general",
      status: "available",
      currentPatient: null,
    },

    {
      bedNumber: "GENERAL-02",
      ward: "general",
      status: "available",
      currentPatient: null,
    },
  ];

  for (const bed of bedsSeed) {
    await Bed.findOneAndUpdate(
      {
        bedNumber: bed.bedNumber,
      },

      bed,

      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  console.log("Seeded hospital beds.");

  // =========================================================
  // PROCEDURE PROTOCOL
  // =========================================================

  const kneeReplacementProtocol = {
    code: "KNEE_REPLACEMENT",

    name: "Knee Replacement",

    department: "orthopedic",

    requiredBedType: "orthopedic",

    requiredTests: ["CBC", "ECG", "BLOOD_GROUP", "X_RAY"],

    otDurationMinutes: 150,
  };

  await ProcedureProtocol.findOneAndUpdate(
    {
      code: kneeReplacementProtocol.code,
    },

    kneeReplacementProtocol,

    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  console.log("Seeded procedure protocol.");

  // =========================================================
  // OPERATION THEATRE 1
  // =========================================================

  await OperationTheatre.findOneAndUpdate(
    {
      OTName: "OT-1",
    },

    {
      OTName: "OT-1",

      supportedProcedures: ["KNEE_REPLACEMENT"],

      slots: [
        {
          date: fmt(tomorrow),

          startTime: "09:00",

          endTime: "11:30",

          status: "available",
        },

        {
          date: fmt(inThreeDays),

          startTime: "10:00",

          endTime: "12:30",

          status: "available",
        },
      ],
    },

    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  // =========================================================
  // OPERATION THEATRE 2
  // =========================================================

  await OperationTheatre.findOneAndUpdate(
    {
      OTName: "OT-2",
    },

    {
      OTName: "OT-2",

      supportedProcedures: ["KNEE_REPLACEMENT"],

      slots: [
        {
          date: fmt(tomorrow),

          startTime: "12:00",

          endTime: "14:30",

          status: "available",
        },

        {
          date: fmt(inThreeDays),

          startTime: "14:00",

          endTime: "16:30",

          status: "available",
        },
      ],
    },

    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  console.log("Seeded operation theatres.");

  // =========================================================
  // PATIENT COMPLETED LAB TESTS
  // =========================================================

  /*
    Knee replacement requires:

    CBC            ✅ completed
    ECG            ❌ intentionally missing
    BLOOD_GROUP    ✅ completed
    X_RAY          ✅ completed

    ECG is intentionally NOT seeded.

    This gives our LangGraph agent
    a missing-test condition later.
  */

  const completedTests = ["CBC", "BLOOD_GROUP", "X_RAY"];

  for (const testName of completedTests) {
    await LabOrder.findOneAndUpdate(
      {
        patient: patient._id,

        testName: testName,
      },

      {
        patient: patient._id,

        testName: testName,

        status: "completed",

        requestedBy: createdDoctors[3]._id,

        result: "Normal",
      },

      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  console.log("Seeded patient completed lab tests.");

  // =========================================================
  // INSURANCE
  // =========================================================

  await Insurance.findOneAndUpdate(
    {
      patient: patient._id,
    },

    {
      patient: patient._id,

      provider: "Star Health",

      policyNumber: "STAR-DEMO-10001",

      status: "active",

      coverageAmount: 500000,

      preAuthorizationRequired: true,

      preAuthorizationStatus: "approved",
    },

    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  console.log("Seeded patient insurance.");

  // =========================================================
  // FINAL OUTPUT
  // =========================================================

  console.log("\n================================");

  console.log("Seed complete!");

  console.log("================================");

  console.log(`Patient login -> ${PATIENT.email} / ${DEMO_PASSWORD}`);

  DOCTORS.forEach((doctor) => {
    console.log(`Doctor login  -> ${doctor.email} / ${DEMO_PASSWORD}`);
  });

  console.log("\n---------- Agent Demo Scenario ----------");

  console.log("Patient   : Aditi Sharma");

  console.log("Doctor    : Dr. Vikram Singh");

  console.log("Procedure : Knee Replacement");

  console.log(`Date      : ${fmt(tomorrow)}`);

  console.log("");

  console.log("Available orthopedic beds:");

  console.log("  ORTHO-01");

  console.log("  ORTHO-03");

  console.log("\nAvailable OTs:");

  console.log("  OT-1 -> 09:00 - 11:30");

  console.log("  OT-2 -> 12:00 - 14:30");

  console.log("\nPre-op tests:");

  console.log("  CBC         -> completed");

  console.log("  ECG         -> MISSING");

  console.log("  BLOOD_GROUP -> completed");

  console.log("  X_RAY       -> completed");

  console.log("\nInsurance:");

  console.log("  Star Health");

  console.log("  Active");

  console.log("  Coverage: ₹5,00,000");

  console.log("  Pre-authorization: approved");

  console.log("================================\n");

  // =========================================================
  // DISCONNECT
  // =========================================================

  await mongoose.disconnect();

  process.exit(0);
};

// =========================
// START SEED
// =========================

seed().catch((error) => {
  console.error("Seeding failed:", error);

  process.exit(1);
});
