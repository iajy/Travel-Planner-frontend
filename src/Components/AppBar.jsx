import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import toast from "react-hot-toast";

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

  const [menu, setMenu] = useState(true);

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
      "https://ajaybinu-travelplanner.duckdns.org/auth/send-otp",
      {
        email: email, 
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setOtpOpen(true);
    toast.success("OTP sent to email");
  } catch (err) {
    console.error(err);
   toast.error("Error sending OTP");
  }
};


  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://ajaybinu-travelplanner.duckdns.org/auth/verify-otp",
        {
          email,
          otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setFlag(true);
    } catch (err) {
      console.error(err);
      toast.error("Wrong OTP");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://ajaybinu-travelplanner.duckdns.org/auth/login", {
        email,
        password,
      });
      const { token, username, userId } = res.data;
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("username", username);
      localStorage.setItem("userId", userId);
      toast.success("Login successful");
      closeLogin();
    } catch (err) {
      // alert("Invalid credentials", err);
      toast.error("Invalid credentials");

    }
  };

  const register = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://ajaybinu-travelplanner.duckdns.org/auth/register", {
        email,
        password,
        username,
      });
      setSignOpen(false);
      setLoginOpen(true);
    } catch (err) {
      toast.error("Registration failed");
    }
  };

  const handleAdmin = async (userId) => {
    try {
      const res = await axios.get("https://ajaybinu-travelplanner.duckdns.org/auth/user-role", {
        params: { userId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setAdmin(res.data.includes("ADMIN"));
    } catch (err) {
      toast.error("Failed to load role");
    }
  };

  const googleLogin = () => {
    window.location.href = "https://ajaybinu-travelplanner.duckdns.org/oauth2/authorization/google";
  };
  const variants = {
    open: {
      clipPath: "circle(1000px at 39px 43px)",
      transition: { type: "tween" },
    },
    closed: {
      clipPath: "circle(25px at 8px 5px)",
      transition: { type: "tween" },
    },
  };

  return (
    <>
      {/* Header / App Bar */}
      <header className="fixed w-full z-50 bg-white/30 backdrop-blur-lg shadow-md border-b border-white/20 px-6 py-4 flex justify-between items-center">
        <div className="flex justify-between w-full md:flex text-3xl font-extrabold text-indigo-600">
          <motion.div
            animate={menu ? "closed" : "open"}
            className="md:hidden bg-red-900 "
          >
            <motion.div
              className="fixed w-1/2 h-screen/2 rounded-2xl "
              variants={variants}
            >
              <div className="">
                {menu ? (
                  <IoMenu size={30} onClick={() => setMenu((prev) => !prev)} />
                ) : (
                  <IoClose size={30} onClick={() => setMenu((prev) => !prev)} />
                )}
              </div>
              {!menu && (
                <div className="bg-white/70 rounded-2xl">
                  <ul className="flex flex-col md:hidden gap-y-8 py-5 px-3 text-sm md:text-base">
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
                          {localStorage
                            .getItem("username")
                            ?.charAt(0)
                            .toUpperCase() || "U"}
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
                </div>
              )}
            </motion.div>
          </motion.div>
          <div>
            <span>Travel</span>
            <span className="text-gray-800">-Planner</span>
          </div>
        </div>
        <nav>
          <ul className="hidden md:flex items-center gap-8 text-sm md:text-base">
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
                  {localStorage.getItem("username")?.charAt(0).toUpperCase() ||
                    "U"}
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
            className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative m-3"
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
            className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative m-3"
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
