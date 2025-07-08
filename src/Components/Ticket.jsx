import React, { useState } from "react";
import axios from "axios";
import AppBar from "./AppBar";
import Footer from "./Footer";
import { motion } from "framer-motion";
import PayPalButton from "./PayPalButton";
import toast from "react-hot-toast";

const Ticket = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [flights, setFlights] = useState([]);
  const [locationNames, setLocationNames] = useState({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("jwtToken");
  const [selectedFlight, setSelectedFlight] = useState(null);


  const fetchIataCode = async (locationName) => {
    try {
      const response = await axios.get(
        "https://ajaybinu-travelplanner.duckdns.org/api/flights/iata",
        { params: { keyword: locationName } ,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data[0]?.iataCode || locationName;
    } catch (error) {
      console.error("IATA code fetch error:", error);
      return locationName;
    }
  };

  const fetchLocationName = async (iataCode) => {
    try {
      const response = await axios.get(
        "https://ajaybinu-travelplanner.duckdns.org/api/flights/location",
        { params: { iataCode } ,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data.data[0];
      return data ? `${data.address.cityName} - ${data.name}` : iataCode;
    } catch (error) {
      console.error("Location name error:", error);
      return iataCode;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please log in first!");
      return;
    }

    setLoading(true);

    try {
      const originCode = await fetchIataCode(origin);
      const destinationCode = await fetchIataCode(destination);
      const response = await axios.get("https://ajaybinu-travelplanner.duckdns.org/api/flights", {
        params: {
          origin: originCode,
          destination: destinationCode,
          departureDate,
          returnDate: returnDate || undefined,
          adults,
          children,
        },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        });

      const flightData = response.data.data || [];
      const locationPromises = flightData.flatMap((flight) => {
        const offer = flight.itineraries[0].segments[0];
        return [
          fetchLocationName(offer.departure.iataCode).then((name) => ({
            [offer.departure.iataCode]: name,
          })),
          fetchLocationName(offer.arrival.iataCode).then((name) => ({
            [offer.arrival.iataCode]: name,
          })),
        ];
      });

      const locations = await Promise.all(locationPromises);
      const mergedLocations = Object.assign({}, ...locations);
      setLocationNames(mergedLocations);
      setFlights(flightData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (flight) => {
    if (!token) {
      toast.error("Please log in first!");
      return;
    }

    try {
      const itineraryId = localStorage.getItem("uuid");
      const price = flight.price.total;
      const bookingRequest = {
        type: "Flight",
        provider: flight.validatingAirlineCodes[0],
        confirmationNumber: "CONFIRM-" + Math.floor(Math.random() * 100000),
        details: `From ${
          locationNames[flight.itineraries[0].segments[0].departure.iataCode]
        } to ${
          locationNames[flight.itineraries[0].segments[0].arrival.iataCode]
        } on ${departureDate} Price: $${price}`,
      };

      const response = await axios.post(
        `https://ajaybinu-travelplanner.duckdns.org/api/itineraries/${itineraryId}/booking`,
        bookingRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Booking successful!");
      } else {
        toast.error("Booking failed.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Booking failed. Please try again.");
    }
  };

  return (
    <>
      <AppBar />
      <div className="p-4 py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-extrabold text-indigo-600 tracking-tight mb-2">
            Flight Search
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Discover the best flight deals with our smart search feature.
          </p>
        </motion.div>

        {/* Search Form */}
        <div className="max-w-5xl mx-auto px-4">
          <form
            onSubmit={handleSearch}
            className="bg-white shadow-lg rounded-2xl p-6 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="origin"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Origin (city or IATA)
                </label>
                <input
                  required
                  id="origin"
                  type="text"
                  placeholder="Enter origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="destination"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Destination (city or IATA)
                </label>
                <input
                  required
                  id="destination"
                  type="text"
                  placeholder="Enter destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="departureDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Departure Date
                </label>
                <input
                  required
                  id="departureDate"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="returnDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Return Date (optional)
                </label>
                <input
                  id="returnDate"
                  type="date"
                  min={
                    new Date(Date.now() + 86400000).toISOString().split("T")[0]
                  }
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="adults"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Adults
                </label>
                <input
                  id="adults"
                  type="number"
                  placeholder="Adults"
                  value={adults}
                  min="1"
                  onChange={(e) => setAdults(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="children"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Children
                </label>
                <input
                  id="children"
                  type="number"
                  placeholder="Children"
                  value={children}
                  min="0"
                  onChange={(e) => setChildren(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Search Flights
              </motion.button>
            </div>
          </form>

          {/* Loader */}
          {loading && (
            <div className="mt-6 flex justify-center items-center space-x-2 text-gray-600">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Searching flights...</span>
            </div>
          )}

          {/* Flight Results */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flights.slice(0, 20).map((flight, idx) => {
              const offer = flight.itineraries[0].segments[0];
              const price = flight.price.total;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
                >
                  <div className="p-5">
                    <h2 className="text-lg font-bold text-gray-800 mb-3">
                      {flight.validatingAirlineCodes[0]}
                    </h2>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <strong className="text-gray-700">From:</strong>{" "}
                        {locationNames[offer.departure.iataCode]} (
                        {offer.departure.iataCode})
                      </p>
                      <p>
                        <strong className="text-gray-700">To:</strong>{" "}
                        {locationNames[offer.arrival.iataCode]} (
                        {offer.arrival.iataCode})
                      </p>
                      <p>
                        <strong className="text-gray-700">Departure:</strong>{" "}
                        {offer.departure.at}
                      </p>
                      <p>
                        <strong className="text-gray-700">Arrival:</strong>{" "}
                        {offer.arrival.at}
                      </p>
                      <p className="font-semibold text-indigo-600">
                        Price: ${price}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleBooking(flight)}
                      className="mt-4 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors font-medium"
                    >
                      Book Now
                    </motion.button>
                    {selectedFlight === flight && (
  <div className="mt-4">
    <h3 className="text-center text-sm mb-2">Pay ${flight.price.total} to confirm:</h3>
    <PayPalButton
      amount={flight.price.total}
      onSuccess={async (order) => {
        // Call your booking handler to save to DB
        await handleBooking(flight); 
        setSelectedFlight(null); // reset
        toast.success("Booking & Payment Successful!");
      }}
    />
  </div>
)}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* No Results Message */}
          {!loading && flights.length === 0 && (
            <div className="mt-10 text-center text-gray-500 italic">
              No flights found. Try adjusting your search criteria.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Ticket;
