import type { FC } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Footer: FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-10 py-10 border-t border-[#E5E8EB] dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        {/* Left */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 flex items-center justify-center">
              <i className="fas fa-infinity text-sm"></i>
            </div>
            <h2 className="text-lg font-bold">BlogSpace</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm max-w-xs">
            {t("footer.label")}
          </p>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-wrap justify-center gap-6 items-start">
          {[t("footer.home"), t("footer.explore"), t("footer.about"), t("footer.contact")].map((item) => (
            <Link
              key={item}
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 hover:scale-105 text-sm font-medium"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Social icons */}
        <div className="flex flex-col gap-4">
          <span className="text-gray-700 dark:text-gray-300 text-sm font-semibold">{t("footer.follow")}</span>
          <div className="flex gap-3">
            {["facebook", "twitter", "instagram"].map((icon) => (
              <a
                key={icon}
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <i className={`fab fa-${icon} text-gray-900 dark:text-gray-100`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 border-t border-gray-300 dark:border-gray-700 pt-4 text-center text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
        © {new Date().getFullYear()} BlogSpace. All rights reserved.
      </div>
    </footer>
  );
};
