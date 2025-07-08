import React, { useEffect, useRef, useState } from "react";
import AppBar from "./AppBar";
import axios from "axios";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import toast from "react-hot-toast";

const MyItineary = () => {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  const [itineraries, setItineraries] = useState([]);
  const [itinerariesCard, setItinerariesCard] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [id, setId] = useState(null);
  const [uuid, setUuid] = useState(null);

  // Handle edit form input change
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setItineraries((prevItineraries) =>
      prevItineraries.map((itinerary, index) => {
        if (index === id) {
          return {
            ...itinerary,
            [name]: ["destination", "interests"].includes(name)
              ? value.split(",").map((item) => item.trim())
              : value,
          };
        } else {
          return itinerary;
        }
      })
    );
  };

  // Toggle edit mode
  const handleEdit = (index, uuid) => {
    setId(index);
    setUuid(uuid);
    setOpenEdit(!openEdit);
  };

  // Close edit form when clicking outside
  const formRef = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openEdit &&
        formRef.current &&
        !formRef.current.contains(event.target)
      ) {
        setOpenEdit(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [openEdit]);

  // Fetch itineraries
  const handleFetch = async () => {
    try {
      const response = await axios.get(
        `https://ajaybinu-travelplanner.duckdns.org/api/itineraries/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setItineraries(response.data);
      setItinerariesCard(!itinerariesCard);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  // Update itinerary
  const itinearyUpdate = async () => {
    try {
      const updatedItinerary = itineraries[id];
      await axios.put(
        `https://ajaybinu-travelplanner.duckdns.org/api/itineraries/${uuid}`,
        updatedItinerary,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setOpenEdit(false);
      toast.success("Itinerary Updated!");
    } catch (error) {
      console.log("Update Error:", error);
    }
  };

  // Delete itinerary
  const itineraryDelete = async (deleteId) => {
    if (window.confirm("Are you sure you want to delete this itinerary?")) {
      try {
        await axios.delete(
          `https://ajaybinu-travelplanner.duckdns.org/api/itineraries/${deleteId}`,
          {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        }
        );
        setItinerariesCard(!itinerariesCard);
      } catch (error) {
        console.log("Delete Error:", error);
      }
    }
  };

  const { ref, inView } = useInView({ threshold: 0.8 });

  

  return (
    <>
      <AppBar />
      <section>
        {/* Background Image */}
        <img
          src="/background_visual-85f87405.svg"
          alt=""
          className="w-screen h-screen object-cover absolute -z-10"
        />

        {/* Hero Text Section */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 100 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="h-full py-20 flex flex-col justify-center items-center bg-black/30 backdrop-blur-sm"
        >
          <div className="text-center flex flex-col gap-4 items-center">
            <h1 className="text-5xl font-bold text-indigo-700 drop-shadow-md">
              Hi {username}
            </h1>
            <p className="text-2xl font-semibold text-blue-800 drop-shadow-sm">
              Your travel plans await you here
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFetch}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md hover:shadow-lg transition-all"
            >
              Show Itineraries
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Edit Form Modal */}
      {openEdit && (
        <section  className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            ref={formRef}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-5xl mx-4 relative"
          >
            <h2 className="text-2xl font-semibold mb-6 text-center">Edit Itinerary</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                itinearyUpdate();
              }}
              className="space-y-6"
            >
              <table className="w-full border-separate border-spacing-4">
                <tbody>
                  <tr className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <td>
                      <label className="block text-left mb-2 font-medium text-gray-700">
                        Destination
                      </label>
                      <input
                        required
                        type="text"
                        name="destination"
                        placeholder="Where to go"
                        value={itineraries[id]?.destination?.join(", ") || ""}
                        onChange={onChangeInput}
                        className="w-full rounded-full px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </td>
                    <td>
                      <label className="block text-left mb-2 font-medium text-gray-700">
                        Starting Date
                      </label>
                      <input
                        required
                        type="date"
                        name="startDate"
                        min={new Date().toISOString().split("T")[0]}
                        value={itineraries[id]?.startDate || ""}
                        onChange={onChangeInput}
                        className="w-full rounded-full px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </td>
                    <td>
                      <label className="block text-left mb-2 font-medium text-gray-700">
                        Title of the Trip
                      </label>
                      <input
                        required
                        type="text"
                        name="title"
                        placeholder="Title Of The Trip"
                        value={itineraries[id]?.title || ""}
                        onChange={onChangeInput}
                        className="w-full rounded-full px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </td>
                  </tr>
                  <tr className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <td>
                      <label className="block text-left mb-2 font-medium text-gray-700">
                        Interests (optional)
                      </label>
                      <input
                        type="text"
                        name="interests"
                        placeholder="e.g., hiking, food, museums"
                        value={itineraries[id]?.interests?.join(", ") || ""}
                        onChange={onChangeInput}
                        className="w-full rounded-full px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </td>
                    <td>
                      <label className="block text-left mb-2 font-medium text-gray-700">
                        Ending Date
                      </label>
                      <input
                        required
                        type="date"
                        name="endDate"
                        min={
                          new Date(Date.now() + 86400000)
                            .toISOString()
                            .split("T")[0]
                        }
                        value={itineraries[id]?.endDate || ""}
                        onChange={onChangeInput}
                        className="w-full rounded-full px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </td>
                    <td>
                      <label className="block text-left mb-2 font-medium text-gray-700">
                        Any Notes
                      </label>
                      <input
                        type="text"
                        name="notes"
                        placeholder="Notes or special requests"
                        value={itineraries[id]?.notes || ""}
                        onChange={onChangeInput}
                        className="w-full rounded-full px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-center mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold shadow-md transition-all"
                >
                  Update
                </motion.button>
              </div>
            </form>
          </motion.div>
        </section>
      )}

      {/* Itinerary Cards */}
      {itinerariesCard && (
        <div className="max-w-6xl mx-auto mt-10 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-3">{item.title}</h2>
                <p className="text-gray-600"><strong>Start Date:</strong> {item.startDate}</p>
                <p className="text-gray-600"><strong>End Date:</strong> {item.endDate}</p>
                <p className="text-gray-600"><strong>Destination:</strong> {item.destination.join(", ")}</p>
                <p className="text-gray-600"><strong>Bookings:</strong> {item.bookings || "None"}</p>
                <div className="mt-4 flex items-end gap-4">
                  <button
                    onClick={() => handleEdit(index, item.id)}
                    className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-full transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => itineraryDelete(item.id)}
                    className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MyItineary;