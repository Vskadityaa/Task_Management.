import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ["low", "medium", "high"], required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["todo", "in progress", "completed"], default: "todo" },
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
