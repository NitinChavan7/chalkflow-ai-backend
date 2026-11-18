const mongoose = require("mongoose");

async function connectDB(uri) {
  try {
    if (!uri) {
      throw new Error("MongoDB URI is missing");
    }

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully");
    console.log("Database:", mongoose.connection.name);

    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
}

module.exports = connectDB;
