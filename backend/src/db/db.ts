import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    
    // Retry once after 5 seconds if the first attempt fails
    setTimeout(() => {
      mongoose.connect(process.env.MONGO_URI as string).catch(err => {
        console.error("❌ MongoDB reconnection failed:", err);
        process.exit(1);
      });
    }, 5000);
  }
};

// Gracefully close the database connection on process exit
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔌 MongoDB disconnected on process termination");
  process.exit(0);
});

export default connectDB;
