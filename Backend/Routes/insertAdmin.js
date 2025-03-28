import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js"; // Ensure path is correct

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Error:", err));

const insertAdmin = async () => {
  const existingAdmin = await User.findOne({ email: "admin@example.com" });
  if (existingAdmin) {
    console.log("⚠️ Admin already exists!");
    mongoose.connection.close();
    return;
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  const admin = new User({
    name: "Admin",
    email: "admin@example.com",
    password: "Admin@123",
    role: "admin"
  });

  await admin.save();
  console.log("✅ Admin user inserted!");
  mongoose.connection.close();
};

insertAdmin();
