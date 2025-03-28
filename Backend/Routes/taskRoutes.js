import express from 'express';
import Task from '../models/Task.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST route to create a new task
router.post("/user/tasks", authenticateToken, async (req, res) => {
  const { title, priority, dueDate, status } = req.body;

  if (!title || !dueDate) {
    return res.status(400).json({ message: "Title and Due Date are required." });
  }

  try {
    // Create a new task
    const newTask = new Task({
      title,
      priority,
      dueDate,
      status: status || "incomplete", // Default status if not provided
      assignedBy: req.user.id, // Assuming req.user contains the logged-in user's details
      user: req.user.id, // Assign the task to the logged-in user
    });

    await newTask.save();
    res.status(201).json({ task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create task." });
  }
});

export default router;
