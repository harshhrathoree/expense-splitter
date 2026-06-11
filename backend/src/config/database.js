import mongoose from "mongoose";
import config from "./config.js";

async function connectDB() {
  try {
    await mongoose.connect(
      config.MONGO_URI
    );

    console.log(
      "MongoDB connected"
    );
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error
    );

    throw error;
  }
}

export default connectDB;