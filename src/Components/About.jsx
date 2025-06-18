import React from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const About = () => {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      {/* Section Header */}
      <section className="flex flex-col items-center text-center gap-3 mb-16">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -100 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-500 text-xl">Travel Planner</p>
          <h2 className="text-4xl font-bold text-indigo-700 mt-2">
            The only tool you'll ever need!
          </h2>
          <p className="text-gray-600 text-xl mt-3">
            Say goodbye to the stress of planning and hello to personalized recommendations, efficient itineraries, and seamless dining experiences.
          </p>
        </motion.div>
      </section>

      {/* Features Grid */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: -100 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Feature 1 */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-4">
            <img src="/map.webp" className="h-16" alt="Map" />
            <span className="text-2xl font-bold text-indigo-700">
              Finding <br /> Destinations
            </span>
          </div>
          <p className="text-gray-600 mt-2">
            Finding the perfect destination is an adventure filled with exploration, culture, nature, and lifelong memories.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-4">
            <img src="/story.webp" className="h-16" alt="Story" />
            <span className="text-2xl font-bold text-indigo-700">
              Personalize <br /> Your Activities
            </span>
          </div>
          <p className="text-gray-600 mt-2">
            Tailor your activities to match your interests for an unforgettable journey.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-4">
            <img src="/food.webp" className="h-16" alt="Food" />
            <span className="text-2xl font-bold text-indigo-700">
              Local Cuisine <br /> Recommendations
            </span>
          </div>
          <p className="text-gray-600 mt-2">
            Savor authentic flavors and dishes that reflect each destination’s soul.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default About;