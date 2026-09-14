const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const healthRoutes = require("./routes/healthRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes =require("./routes/appointmentRoutes");
const wellnessRoutes = require("./routes/wellnessRoutes");
const learningRoutes = require("./routes/learningRoutes");
const aiRoutes =require("./routes/aiRoutes");
const dashboardRoutes =require("./routes/dashboardRoutes");
const timelineRoutes =require("./routes/timelineRoutes");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments",appointmentRoutes);
app.use("/api/wellness",wellnessRoutes);
app.use("/api/learning",learningRoutes);
app.use("/api/ai",aiRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use(
  "/api/timeline",
  timelineRoutes
);

app.get("/", (req, res) => {
  res.json({
    message: "HealthBridge AI Server is running",
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });