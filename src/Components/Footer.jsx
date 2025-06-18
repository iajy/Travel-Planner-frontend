import React from "react";

const Footer = () => {
  return (
    <>
      {/* Spacing Divider */}
      <div className="py-20 bg-white"></div>

      {/* Footer Section */}
      <footer className="bg-gradient-to-r from-gray-50 to-blue-50 text-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand Column */}
            <div>
              <h2 className="text-3xl font-extrabold text-indigo-600">
                Travel<span className="text-gray-800">-Planner</span>
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Life’s too short to stay in one place – go explore, dream big, and wander freely.
              </p>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-indigo-700">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    Terms and Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-indigo-700">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Itineraries Links */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-indigo-700">Itineraries</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    Find Destinations
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-8 border-t border-indigo-300/50" />

          {/* Copyright */}
          <div className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Travel-Planner. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;