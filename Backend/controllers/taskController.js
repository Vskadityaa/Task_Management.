import Task from "../models/Task.js";

// Create a new task
export const createTask = async (req, res) => {
  const { title, description, priority, dueDate, status, assignedBy, user } = req.body;

  try {
    // Create new task
    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      status: status || "todo", // Default to "todo"
      assignedBy,
      user,
    });

    await task.save();
    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all tasks for a user
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }); // Assuming `user.id` comes from JWT
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update a task (e.g., change status or mark as completed)
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Check if user is authorized to update the task (based on assigned user or admin)
    if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to update this task" });
    }

    // Update task status (you can update other fields similarly)
    task.status = status || task.status;
    await task.save();

    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Check if user is authorized to delete the task
    if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this task" });
    }

    await task.remove();
    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
