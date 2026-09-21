const mongoose = require("mongoose");

export const connectDB = async () => {
  try {
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
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};
