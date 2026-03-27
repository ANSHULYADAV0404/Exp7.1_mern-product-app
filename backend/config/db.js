import mongoose from "mongoose";

let isMongoConnected = false;

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn("MongoDB URI not found. Running with mock product data.");
    return false;
  }

  try {
    await mongoose.connect(mongoUri);
    isMongoConnected = true;
    console.log("MongoDB connected successfully.");
    return true;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    console.warn("Falling back to mock product data.");
    isMongoConnected = false;
    return false;
  }
};

export const getDatabaseStatus = () => isMongoConnected;
