import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const switchLanguage = (lang: "en" | "ru") => {
    changeLanguage(lang);
    setShowLangDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setShowLangDropdown(!showLangDropdown)}
        className="h-8 sm:h-10 px-2 sm:px-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-1 sm:gap-2 transition-transform duration-200 hover:scale-105"
      >
        <i className="fas fa-globe text-gray-600 dark:text-gray-300 text-xs sm:text-sm"></i>
        <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">
          {currentLanguage.toUpperCase()}
        </span>
      </button>

      {showLangDropdown && (
        <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-10 min-w-[140px] sm:min-w-[160px] overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => switchLanguage("en")}
            className="w-full cursor-pointer text-left px-4 py-2 sm:py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 sm:gap-3"
          >
            <img src="https://flagcdn.com/us.svg" alt="English" className="h-3 w-5 sm:h-4 sm:w-6 object-cover rounded-sm" />
            <span>English</span>
          </button>
          <button
            onClick={() => switchLanguage("ru")}
            className="w-full cursor-pointer text-left px-4 py-2 sm:py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 sm:gap-3"
          >
            <img src="https://flagcdn.com/ru.svg" alt="Russian" className="h-3 w-5 sm:h-4 sm:w-6 object-cover rounded-sm" />
            <span>Русский</span>
          </button>
        </div>
      )}
    </div>
  );
};
