import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import { FaTasks, FaCheckCircle, FaClock, FaList, FaUsers, FaTrash, FaCog, FaUserCircle, FaSignOutAlt, FaPlus } from "react-icons/fa";

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState({ name: "", priority: "Low", status: "todo" });
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [userProfile, setUserProfile] = useState({ name: "", email: "" });

  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();

    // Fetching the logged-in admin profile from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUserProfile({
        name: loggedInUser.name || "Admin", // Default to "Admin" if not available
        email: loggedInUser.email || "Not Available",
      });
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/tasks");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTask = async () => {
    if (!newTask.name) {
      alert("Please enter a task name");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/admin/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask), // Send task data to backend
      });

      if (!response.ok) {
        throw new Error("Failed to assign task");
      }

      alert("Task assigned successfully!");
      fetchTasks(); // Refresh task list after assigning new task
      setNewTask({ name: "", priority: "Low", status: "todo" }); // Reset form fields
    } catch (err) {
      alert(err.message);
    }
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((task) => task.status === "completed").length,
    inProgress: tasks.filter((task) => task.status === "in progress").length,
    todos: tasks.filter((task) => task.status === "todo").length,
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>TaskMe</h2>
        <ul>
          <li><FaTasks /> Dashboard</li>
          <li><FaList /> Tasks</li>
          <li><FaCheckCircle /> Completed</li>
          <li><FaClock /> In Progress</li>
          <li><FaUsers /> Team</li>
          <li><FaTrash /> Trash</li>
          <li><FaCog /> Settings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="top-bar">
          <div className="profile-section">
            <FaUserCircle
              className="profile-icon"
              onClick={() => setShowProfileOptions(!showProfileOptions)}
            />
            {showProfileOptions && (
              <div className="profile-dropdown">
                <p>{userProfile.name}</p>
                <p>{userProfile.email}</p>
                <button onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <h1>Admin Dashboard</h1>

        {/* Task Progress Summary */}
        <div className="task-summary">
          <div className="card"><p>Total Tasks</p><h3>{taskStats.total}</h3></div>
          <div className="card"><p>Completed</p><h3>{taskStats.completed}</h3></div>
          <div className="card"><p>In Progress</p><h3>{taskStats.inProgress}</h3></div>
          <div className="card"><p>To-Dos</p><h3>{taskStats.todos}</h3></div>
        </div>

        {/* 🆕 Task Assignment Form */}
        <div className="assign-task-form">
          <h2>Assign Task</h2>
          <input
            type="text"
            placeholder="Enter task name"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          />
          <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}>
            <option value="todo">To-Do</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={handleAssignTask}>
            <FaPlus /> Assign Task
          </button>
        </div>

        {/* Task List */}
        <h2>All Tasks</h2>
        {loading ? (
          <p>Loading tasks...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.name}</td>
                  <td>{task.status}</td>
                  <td>{task.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
