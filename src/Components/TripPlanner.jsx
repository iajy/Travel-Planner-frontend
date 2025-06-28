import React, { useState } from "react";
import axios from "axios";

export default function TripPlanner() {
  const [form, setForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    interests: "",
  });
  const [result, setResult] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://ajaybinu-travelplanner.duckdns.org/api/generate-itinerary",
        form
      );
      const aiResponse = res.data;
      console.log("AI response:", res.data);

      setResult(aiResponse.choices[0].message.content);
    } catch (err) {
      console.error("API error:", err.response?.data || err.message);
      alert(
        "Something went wrong: " + (err.response?.data?.error || err.message)
      );
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">AI Trip Planner</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="date"
          name="startDate"
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="date"
          name="endDate"
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="text"
          name="interests"
          placeholder="Interests (optional)"
          onChange={handleChange}
          className="input"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Generate Itinerary
        </button>
      </form>
      <div className="mt-6 whitespace-pre-wrap text-gray-800 bg-gray-100 p-4 rounded">
        {result}
      </div>
    </div>
  );
}
