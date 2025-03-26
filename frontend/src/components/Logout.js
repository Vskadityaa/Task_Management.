import { useAuth } from "../App"; // Import useAuth to manage auth state
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");  // Clear token
        localStorage.removeItem("role");   // Clear role
        setAuth({ token: null, role: null }); // Reset auth state
        navigate("/login");  // Redirect to login page
    };

    return <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>;
};

export default Logout;
