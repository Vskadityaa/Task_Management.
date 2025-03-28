import React, { createContext, useContext, useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";

// ✅ Create Auth Context
const AuthContext = createContext(null);

// ✅ Auth Provider Component
const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role"),
    });

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            const role = localStorage.getItem("role");
            setAuth({ token, role });
        };

        checkAuth();
        window.addEventListener("storage", checkAuth); // Listen for changes in localStorage

        return () => window.removeEventListener("storage", checkAuth);
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

// ✅ Hook to Use Auth Context
const useAuth = () => useContext(AuthContext);

// ✅ Private Route (Redirect to Login If Not Authenticated)
const PrivateRoute = ({ children }) => {
    const { auth } = useAuth();
    const location = useLocation();

    if (!auth.token) {
        console.log("🔴 Not logged in! Redirecting to /login");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

// ✅ Admin Route (Only for Admins)
const AdminRoute = ({ children }) => {
    const { auth } = useAuth();
    return auth.token && auth.role === "admin" ? children : <Navigate to="/" replace />;
};

// ✅ Main App Component
const App = () => {
    return (
        <AuthProvider>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} /> {/* Only for authenticated users */}
                <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} /> {/* Only for admins */}

                {/* Fallback route for unknown paths */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    );
};

export default App;
