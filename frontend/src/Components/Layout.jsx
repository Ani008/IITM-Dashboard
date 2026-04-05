import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Bell, Mail, ChevronDown } from "lucide-react";
import ActivityDropdown from "./ActivityDropdown"; // Make sure the path is correct

const Layout = ({ children }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role); // 👈 extracting role
      } catch (error) {
        localStorage.clear();
        console.error("Invalid token");
      }
    }
    setIsChecking(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login"); // ✅ FIXED
  };

  if (isChecking) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        {/* Navbar */}
        <header className="px-8 py-4 flex justify-end items-center gap-6 border-b border-gray-100 bg-white">
          <div className="flex gap-4 text-gray-400">
            {/* Bell Icon with Hover and Click Logic */}
            <div
              className="relative"
              onMouseEnter={() => setShowNotifications(true)}
              onMouseLeave={() => setShowNotifications(false)}
            >
              <button
                onClick={() => navigate("/recentactivity")}
                className="relative focus:outline-none flex items-center"
              >
                <Bell
                  size={20}
                  className="cursor-pointer hover:text-gray-600 transition-colors"
                />
                {/* Red Notification Dot */}
                <span className="absolute -top-1 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Show Dropdown on Hover */}
              {showNotifications && <ActivityDropdown />}
            </div>
          </div>

          <div className="relative">
            <div
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer"
            >
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-xs">
                {role.charAt(0)}
              </div>
              <span className="text-sm font-semibold text-gray-700">{role || "User"}</span>

              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </div>

            {open && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="max-w-[1200px] mx-auto p-6">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
