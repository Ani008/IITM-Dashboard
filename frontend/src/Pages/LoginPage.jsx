import React, { useState } from "react";
import { ShieldCheck, Lock, ChevronDown, Library } from "lucide-react";
import libraryImage from "../assets/569.jpg";
import { useNavigate } from "react-router-dom"; // Add this
import logo from "../assets/logo.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("USER");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role, password }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        // Check if the status code is 200-299
        console.log("Login Attempt Successful");

        localStorage.setItem("token", data.token);

        // Navigate to the dashboard/home route
        navigate("/");
      } else {
        // Handle login failure (wrong password, etc.)
        alert(data.message || "Login failed. Please check your password.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-white">
      {/* Left Side: Login Form */}
      <div className="flex flex-col justify-center w-full px-8 md:w-1/2 lg:px-24">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <img
              src={logo}
              alt="ARAI Logo"
              className="h-15 w-auto object-contain"
            />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-10">
            Knowledge Center Modules
          </h1>


          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Select Role
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="STAFF">STAFF</option>
                  <option value="USER">USER</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
                <Lock className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm"></div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transform transition-active active:scale-[0.98] shadow-lg shadow-indigo-200"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>

      <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-[#f0f4ff] relative overflow-hidden">
        <div className="w-full max-w-2xl p-4 flex justify-center items-center">
          <img
            src={libraryImage}
            alt="Illustration"
            className="w-full h-auto max-h-[600px] object-contain mix-blend-multiply opacity-90"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
