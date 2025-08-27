import type { FC } from "react";
import { Link } from "react-router-dom";


export const Footer: FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-900 px-10 py-10 border-t border-[#E5E8EB]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        {/* Left */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center">
              <i className="fas fa-infinity text-sm"></i>
            </div>
            <h2 className="text-lg font-bold">BlogSpace</h2>
          </div>
          <p className="text-gray-700 text-sm max-w-xs">
            Share your thoughts and discover amazing stories from people around
            the world.
          </p>
        </div>

        {/* Center */}
        <nav className="flex flex-wrap justify-center gap-6 items-start">
          {["Home", "Explore", "About", "Contact"].map((item) => (
            <Link
              key={item}
              to="/"
              className="text-gray-700 hover:text-gray-900 transition-colors duration-200 hover:scale-105 text-sm font-medium"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Right: Social buttons */}
        <div className="flex flex-col gap-4">
          <span className="text-gray-700 text-sm font-semibold">Follow us</span>
          <div className="flex gap-3">
            {["facebook", "twitter", "instagram"].map((icon) => (
              <a
                key={icon}
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
              >
                <i className={`fab fa-${icon} text-gray-900`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 border-t border-gray-300 pt-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} BlogSpace. All rights reserved.
      </div>
    </footer>
  );
};
