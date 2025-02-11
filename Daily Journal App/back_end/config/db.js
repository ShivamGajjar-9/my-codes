const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  }

  // Optional: Event listeners for better debugging
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB Connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("❌ MongoDB Disconnected");
  });
};

module.exports = connectDB;