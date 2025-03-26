import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const role = localStorage.getItem("role"); // Get role from storage

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="text-gray-600 mt-2">Oops! The page you are looking for does not exist.</p>

      <div className="mt-4 flex space-x-4">
        <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded">
          Go to User Dashboard
        </Link>
        
        {role === "admin" && (
          <Link to="/admin" className="px-4 py-2 bg-green-500 text-white rounded">
            Go to Admin Dashboard
          </Link>
        )}
      </div>
    </div>
  );
};

export default NotFound;
