import { Link } from "react-router-dom";
import Logout from "./Logout";  // Import Logout component
import { useAuth } from "../App";

const Navbar = () => {
    const { auth } = useAuth();  // Get auth state

    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between">
            <div>
                <Link to="/" className="px-4">Home</Link>
                {auth.role === "admin" && <Link to="/admin" className="px-4">Admin</Link>}
            </div>
            {auth.token ? <Logout /> : <Link to="/login">Login</Link>}
        </nav>
    );
};

export default Navbar;
