import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import adminRoutes from "./routes/adminRoutes.js"; // Admin Routes
import taskRoutes from "./routes/taskRoutes.js";   // Task Routes
import userRoutes from "./routes/userRoutes.js";   // User Routes

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Enable JSON request body parsing

// ✅ Corrected API Routes
app.use("/api/admin", adminRoutes); // Routes for admin (e.g., /api/admin/tasks)
app.use("/api/tasks", taskRoutes);  // Routes for tasks (e.g., /api/tasks)
app.use("/api/users", userRoutes);  // Routes for users (e.g., /api/users)

// Default Route
app.get("/", (req, res) => {
    res.send("Task Management API is running...");
});

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Database connected successfully"))
.catch((err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
