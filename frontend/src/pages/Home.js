import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaList,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

function Home() {
  const navigate = useNavigate();
  const [adminTasks, setAdminTasks] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [userProfile, setUserProfile] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      console.warn("🔴 No token found! Redirecting to login.");
      navigate("/login");
      return;
    }

    setUserProfile({
      name: localStorage.getItem("loggedInUser") || "User",
      email: localStorage.getItem("email") || "Not Available",
      phone: localStorage.getItem("phone") || "Not Available",
    });

    role === "admin" ? fetchAdminTasks() : fetchUserTasks();
  }, [navigate]);

  const fetchAdminTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setAdminTasks(data.tasks || []);
    } catch (error) {
      setError("Error fetching admin tasks.");
      console.error("Error fetching admin tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/user/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setUserTasks(data.tasks || []);
    } catch (error) {
      setError("Error fetching user tasks.");
      console.error("Error fetching user tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = () => {
    if (!taskName.trim() || !dueDate) {
      alert("Please enter task details");
      return;
    }
    const newTask = { name: taskName.trim(), priority, dueDate, status: "todo" };
    setUserTasks((prevTasks) => [...prevTasks, newTask]);
    setTaskName("");
    setPriority("low");
    setDueDate("");
  };

  const deleteTask = (index) => {
    setUserTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  const submitTask = (index) => {
    setCompletedTasks((prevTasks) => [...prevTasks, adminTasks[index]]);
    setAdminTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  const isTaskExpired = (dueDate) => new Date(dueDate) < new Date();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">TaskMe</h2>
        <ul>
          <li>
            <FaTasks /> Dashboard
          </li>
          <li>
            <FaList /> My To-Do List
          </li>
          <li>
            <FaCheckCircle /> Completed
          </li>
          <li>
            <FaClock /> In Progress
          </li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <input type="text" placeholder="Search..." className="search-bar" />
          <div className="profile-section">
            <FaUserCircle
              className="profile-icon"
              onClick={() => setShowProfileOptions(!showProfileOptions)}
            />
            {showProfileOptions && (
              <div className="profile-dropdown">
                <p>{userProfile.name}</p>
                <p>{userProfile.email}</p>
                <p>{userProfile.phone}</p>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>

        {/* Task Summary */}
        <div className="task-summary">
          <h3>Task Overview</h3>
          <p>📌 Pending Tasks: {userTasks.length}</p>
          <p>✅ Completed Tasks: {completedTasks.length}</p>
        </div>

        {/* Task Section */}
        <div className="task-section">
          <h2>Admin Assigned Tasks</h2>
          <div className="task-list">
            {adminTasks.length > 0 ? (
              adminTasks.map((task, index) => (
                <div
                  key={index}
                  className={`task ${task.priority} ${isTaskExpired(task.dueDate) ? "expired" : ""}`}
                >
                  <span>{task.name} - Due: {task.dueDate}</span>
                  {!isTaskExpired(task.dueDate) && (
                    <button className="submit" onClick={() => submitTask(index)}>
                      Submit
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No tasks assigned</p>
            )}
          </div>

          <h2>My To-Do List</h2>
          <div className="add-task">
            <input
              type="text"
              placeholder="Enter Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <button onClick={addTask}>Add Task</button>
          </div>

          <div className="task-list">
            {userTasks.map((task, index) => (
              <div key={index} className={`task ${task.priority} ${isTaskExpired(task.dueDate) ? "expired" : ""}`}>
                <span>{task.name} - Due: {task.dueDate}</span>
                <button className="delete" onClick={() => deleteTask(index)}>Delete</button>
              </div>
            ))}
          </div>

          <h2>Completed Tasks</h2>
          <div className="task-list">
            {completedTasks.map((task, index) => (
              <div key={index} className="task completed">
                <span>{task.name} - Completed ✅</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
