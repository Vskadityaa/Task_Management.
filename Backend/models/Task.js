import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ["todo", "in progress", "completed"], default: "todo" },
  assignedBy: { type: String, required: true }, // "admin" or specific user ID
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User Model
}, { timestamps: true });

const Task = mongoose.model("Task", TaskSchema);

export default Task;
