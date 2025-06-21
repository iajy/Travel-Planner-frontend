import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Destination = () => {
 
  const { ref, inView } = useInView({
    threshold: 0.2,
  });

  return (
    <div>
      <section id="destination" className="flex flex-col justify-center items-center gap-3">
        <img
          src="/background_visual-85f87405.svg"
          className="absolute object-cover w-full"
          alt=""
        />
        <h2 className="text-4xl font-extrabold text-indigo-700">
          Top Destinations
        </h2>
        <p className="text-xl text-center text-gray-600">
          Unlock the secrets of this captivating destination, <br />
          where hidden gems and cultural treasures await discovery.
        </p>
        <div className="flex">
          <motion.div className="hidden md:flex flex-col gap-10 p-4 m-4 ">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, x: -100 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-2xl"
            >
              <img
                src="/london-eye-351203_1280.jpg"
                alt=""
                className="h-60 w-150 object-cover rounded-2xl transition-transform transform duration-600 hover:scale-110 hover:brightness-50 cursor-pointer"
              />
              <div
                className="absolute left-5 top-30 flex flex-col text-white cursor-pointer"
              >
                <span className="text-3xl font-bold">Trip to London</span>
                <p className="text-sm leading-relaxed ">
                  Discover London’s timeless charm and immerse yourself
                  in its rich history, bustling streets, vibrant culture, and
                  awe-inspiring landmarks around every corner.
                </p>
              </div>
            </motion.div>
            <motion.div
              ref={ref}
              initial={{ opacity: 0, x: -100 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative overflow-hidden rounded-2xl"
            >
              <img
                src="/river-3740371_1280.jpg"
                alt=""
                className="h-100 w-150 object-cover rounded-2xl transition-transform transform duration-600 hover:scale-110 hover:brightness-50 cursor-pointer"
              />
              <div
                className="absolute left-5 top-60 flex flex-col text-white cursor-pointer"
              >
                <span className="text-3xl font-bold">Trip to Switzerland</span>
                <p className="text-sm leading-relaxed max-w-xs">
                  Discover the breathtaking beauty of Switzerland with
                  majestic mountains, serene lakes, charming villages, and a
                  perfect blend of adventure and relaxation.
                </p>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 100 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-10 p-4 m-4"
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="/taj-mahal-383083_1280.jpg"
                alt=""
                className="h-110 w-100 object-cover rounded-2xl transition-transform transform duration-600 hover:scale-110 hover:brightness-50 cursor-pointer"
              />
              <div
                className="absolute left-5 top-70 flex flex-col text-white cursor-pointer"
              >
                <span className="text-3xl font-bold">Trip to India</span>
                <p className="text-sm leading-relaxed max-w-xs">
                  Embark on a mesmerizing trip to India,
                  exploring ancient temples, vibrant markets, diverse landscapes,
                  and the warmth of its rich culture.
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="/brazil-4809011_1280.jpg"
                alt=""
                className="h-50 w-100 object-cover rounded-2xl transition-transform transform duration-600 hover:scale-110 hover:brightness-50 cursor-pointer"
              />
              <div
                className="absolute left-5 top-25 flex flex-col text-white cursor-pointer"
              >
                <span className="text-3xl font-bold">Trip to Brazil</span>
                <p className="text-sm leading-relaxed max-w-xs">
                  Explore Brazil’s vibrant culture, colorful festivals, and natural wonders today.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Destination;