import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Destination from "./Destination";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import About from "./About";
import AppBar from "./AppBar";
import Footer from "./Footer";
import toast from "react-hot-toast";

const Hero = () => {
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("jwtToken");
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [itinerary, setItinerary] = useState({
    username: username,
    userId: userId,
    title: "",
    startDate: "",
    endDate: "",
    destination: [],
    interests: [],
    notes: "",
    collaborators: [],
  });

  const handleForm = () => {
    if (token) {
      setOpenForm(!openForm);
    } else {
      toast.error("Login First...");
    }
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    if (["destination", "interests", "collaborators"].includes(name)) {
      setItinerary((prev) => ({
        ...prev,
        [name]: value.split(",").map((item) => item.trim()),
      }));
    } else {
      setItinerary((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const [result, setResult] = useState("");
  const [form, setForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    interests: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "https://ajaybinu-travelplanner.duckdns.org/api/generate-itinerary",
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const aiResponse = res.data;
      console.log("AI response:", res.data);
      setResult(aiResponse.choices[0].message.content);
      localStorage.setItem("result", result);
    } catch (err) {
      console.error("API error:", err.response?.data || err.message);
      alert(
        "Something went wrong: " + (err.response?.data?.error || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const itinearyHandle = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://ajaybinu-travelplanner.duckdns.org/api/itineraries",
        itinerary,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);
      const uuid = res.data.id;
      localStorage.setItem("uuid", uuid);
      setItinerary({
        username: username,
        userId: userId,
        title: "",
        startDate: "",
        endDate: "",
        destination: [],
        interests: [],
        notes: "",
        collaborators: [],
      });
      toast.success("Itinerary created successfully!");
      setOpenForm(false);
    } catch (err) {
      toast.error("Itinerary created failed");
    }
  };

  const { ref, inView } = useInView({ threshold: 0.5 });

  const formRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openForm &&
        formRef.current &&
        !formRef.current.contains(event.target)
      ) {
        setOpenForm(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openForm]);

  return (
    <>
      <AppBar />
      <section id="hero" className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <img
          src="/landing-hero.jpg"
          alt="Mountain Adventure"
          className="w-full h-full object-cover absolute -z-10"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-blue-800 to-cyan-900 opacity-20"></div>

        {/* Positioned Text Block (Inside Blue Circle) */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="absolute top-[55%] left-[50%] md:left-[70%] -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-[600px] p-5 z-20"
        >
          <h1
            className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-3"
            style={{ fontSize: "3 rem", lineHeight: "1.2" }}
          >
            Your next Adventure
          </h1>
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontSize: "2rem", lineHeight: "1.2" }}
          >
            Starts Here..
          </h2>
          <p className="text-lg text-white mb-6" style={{ fontSize: "1.2rem" }}>
            Life’s too short to stay in one place – go explore, dream big, and
            wander freely.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleForm}
            className="mt-2 px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow-md hover:shadow-xl transition-all"
          >
            Get Start Your Trip
          </motion.button>
        </motion.div>

        {/* Modal Form */}
        {openForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              ref={formRef}
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-4xl mx-4 relative"
            >
              <button
                onClick={() => setOpenForm(false)}
                className="absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-red-500 transition"
              >
                &times;
              </button>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                  itinearyHandle(e);
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-left mb-2 font-medium text-gray-700">
                      Destination
                    </label>
                    <input
                      required
                      type="text"
                      name="destination"
                      placeholder="Where to go"
                      value={itinerary.destination.join(", ")}
                      onChange={(e) => {
                        onChangeInput(e);
                        handleChange(e);
                      }}
                      className="w-full rounded-full px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-left mb-2 font-medium text-gray-700">
                      Title of the Trip
                    </label>
                    <input
                      required
                      type="text"
                      name="title"
                      placeholder="Title Of The Trip"
                      value={itinerary.title}
                      onChange={onChangeInput}
                      className="w-full rounded-full px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-left mb-2 font-medium text-gray-700">
                      Starting Date
                    </label>
                    <input
                      required
                      type="date"
                      name="startDate"
                      min={new Date().toISOString().split("T")[0]}
                      value={itinerary.startDate}
                      onChange={(e) => {
                        onChangeInput(e);
                        handleChange(e);
                      }}
                      className="w-full rounded-full px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-left mb-2 font-medium text-gray-700">
                      Ending Date
                    </label>
                    <input
                      required
                      type="date"
                      name="endDate"
                      min={
                        itinerary.startDate
                          ? new Date(
                              new Date(itinerary.startDate).getTime() + 86400000
                            )
                              .toISOString()
                              .split("T")[0]
                          : new Date().toISOString().split("T")[0]
                      }
                      value={itinerary.endDate}
                      onChange={(e) => {
                        onChangeInput(e);
                        handleChange(e);
                      }}
                      className="w-full rounded-full px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-left mb-2 font-medium text-gray-700">
                      Interests (optional)
                    </label>
                    <input
                      type="text"
                      name="interests"
                      placeholder="e.g., hiking, food, museums"
                      value={itinerary.interests.join(", ")}
                      onChange={(e) => {
                        onChangeInput(e);
                        handleChange(e);
                      }}
                      className="w-full rounded-full px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-left mb-2 font-medium text-gray-700">
                      Any Notes
                    </label>
                    <input
                      type="text"
                      name="notes"
                      placeholder="Notes or special requests"
                      value={itinerary.notes}
                      onChange={onChangeInput}
                      className="w-full rounded-full px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex justify-center mt-6">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    Generate a Package
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </section>
      {loading && (
        <div className="mt-6 flex justify-center items-center space-x-2 text-gray-600">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Your Trip Plan is Generating...</span>
        </div>
      )}

      {/* Result Output */}
      {result && (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-md text-gray-800 whitespace-pre-wrap">
          {result}
        </div>
      )}

      <About />
      <Destination />
      <Footer />
    </>
  );
};

export default Hero;
