import mongoose from "mongoose";
import env from "../config/env.js";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(env.mongoUrl);
    console.log("MongoDB connected successfully.");
  }
  catch (error) {
    console.error("MongoDB connection failed");
    console.error(error.message);
    process.exit(1);
  }
}

export default connectMongoDB;