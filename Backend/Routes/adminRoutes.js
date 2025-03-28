import express from "express";
import Task from "../models/Task.js"; // ✅ Ensure correct model path

const router = express.Router();

// ✅ Create a Task (POST /api/admin/tasks)
router.post("/tasks", async (req, res) => {
    try {
        const { name, description, priority, dueDate } = req.body;

        // Validate Input
        if (!name || !description || !priority || !dueDate) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const newTask = new Task({ name, description, priority, dueDate, status: "todo" });

        // Save to Database
        await newTask.save();

        return res.status(201).json({ success: true, message: "Task created successfully!" });
    } catch (error) {
        console.error("❌ Task creation error:", error);
        return res.status(500).json({ success: false, message: "Server error, please try again." });
    }
});

export default router;
