import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AppBar = () => {
  const [signOpen, setSignOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [optOpen, setOtpOpen] = useState(false);
  const [flag, setFlag] = useState(false);
  const [sideBar, setSideBar] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const loginOverlay = () => {
    setLoginOpen(true);
    setSignOpen(false);
  };

  const signOverlay = () => {
    setLoginOpen(false);
    setSignOpen(true);
  };

  const closeLogin = () => {
    setLoginOpen(false);
    setSignOpen(false);
    setOtpOpen(false);
    setFlag(false);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8080/auth/send-otp",
        {
          email,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      setOtpOpen(true);
      alert("OTP sent to email");
    } catch (err) {
      alert("Error sending OTP", err);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8080/auth/verify-otp",
        {
          email,
          otp,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      setFlag(true);
    } catch (err) {
      alert("Wrong OTP", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });
      const { token, username, userId } = res.data;
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("username", username);
      localStorage.setItem("userId", userId);
      alert("Login successful");
      closeLogin();
    } catch (err) {
      alert("Invalid credentials", err);
    }
  };

  const register = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/auth/register", {
        email,
        password,
        username,
      });
      setSignOpen(false);
      setLoginOpen(true);
    } catch (err) {
      alert("Registration failed", err);
    }
  };

  const handleAdmin = async (userId) => {
    try {
      const res = await axios.get("http://localhost:8080/auth/user-role", {
        params: { userId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setAdmin(res.data.includes("ADMIN"));
    } catch (err) {
      alert("Failed to load role", err);
    }
  };

  const googleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <>
      {/* Header / App Bar */}
      <header className="fixed w-full z-50 bg-white/30 backdrop-blur-lg shadow-md border-b border-white/20 px-6 py-4 flex justify-between items-center">
        <div className="text-3xl font-extrabold text-indigo-600">
          Travel<span className="text-gray-800">-Planner</span>
        </div>
        <nav>
          <ul className="flex items-center gap-8 text-sm md:text-base">
            <Link to={"/"}>
              <li className="hover:text-indigo-400 transition cursor-pointer">
                Home
              </li>
            </Link>
            <li
              onClick={() =>
                document
                  .getElementById("destination")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-indigo-400 transition cursor-pointer"
            >
              Destinations
            </li>
            <Link to={"/ticket"}>
              <li className="hover:text-indigo-400 transition cursor-pointer">
                Tickets
              </li>
            </Link>
           
            {localStorage.getItem("jwtToken") ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setSideBar(!sideBar);
                    handleAdmin(localStorage.getItem("userId"));
                  }}
                  className="w-10 h-10 bg-indigo-600 text-white rounded-full text-lg font-bold"
                >
                  {localStorage.getItem("username") ?.charAt(0).toUpperCase() || "U"}
                </button>
                {sideBar && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-12 right-0 w-48 bg-white text-gray-800 rounded-xl shadow-xl overflow-hidden"
                  >
                    <Link to={"/myitineary"}>
                      <div className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
                        My Itinerary
                      </div>
                    </Link>
                    {admin && (
                      <Link to={"/admin"}>
                        <div className="px-4 py-3 hover:bg-blue-50 text-blue-600 cursor-pointer">
                          Admin Panel
                        </div>
                      </Link>
                    )}
                    <div
                      onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}
                      className="px-4 py-3 hover:bg-red-50 text-red-600 cursor-pointer"
                    >
                      Logout
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <button
                onClick={loginOverlay}
                className="ml-4 px-5 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Login
              </button>
            )}
          </ul>
        </nav>
      </header>

      {/* Login Modal */}
      {loginOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative"
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
              Login
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-full transition font-medium"
              >
                Login
              </button>
              <button
                type="button"
                onClick={googleLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full transition font-medium"
              >
                Login with Google
              </button>
              <p className="text-center text-sm mt-4">
                Don’t have an account?{" "}
                <span
                  onClick={signOverlay}
                  className="text-indigo-600 hover:underline cursor-pointer"
                >
                  Sign up
                </span>
              </p>
            </form>
            <button
              onClick={closeLogin}
              className="absolute top-3 right-4 text-xl font-bold text-gray-500 hover:text-red-500 transition"
            >
              &times;
            </button>
          </motion.div>
        </div>
      )}

      {/* Signup Modal */}
      {signOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              Create Account
            </h2>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {!optOpen ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-full transition"
                >
                  Send OTP
                </button>
              ) : !flag ? (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 border border-yellow-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-full transition"
                  >
                    Verify OTP
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={register}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-full transition"
                  >
                    Sign Up
                  </button>
                </>
              )}
              <p className="text-center text-sm mt-4">
                Already have an account?{" "}
                <span
                  onClick={loginOverlay}
                  className="text-indigo-600 hover:underline cursor-pointer"
                >
                  Login
                </span>
              </p>
            </form>
            <button
              onClick={closeLogin}
              className="absolute top-3 right-4 text-xl font-bold text-gray-500 hover:text-red-500 transition"
            >
              &times;
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AppBar;
