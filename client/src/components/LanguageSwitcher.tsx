import { useState } from "react";

export const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState("en");
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const switchLanguage = (lang: string) => {
    setCurrentLang(lang);
    setShowLangDropdown(false);
    // Here you would implement actual localization logic
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowLangDropdown(!showLangDropdown)}
        className="h-10 px-3 cursor-pointer bg-white rounded-xl border border-gray-200 flex items-center gap-2 transition-transform duration-200 hover:scale-105"
      >
        <i className="fas fa-globe text-gray-600 text-sm"></i>
        <span className="text-xs font-semibold text-gray-700">
          {currentLang.toUpperCase()}
        </span>
      </button>
      {showLangDropdown && (
        <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-10 min-w-[140px] overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => switchLanguage("en")}
            className="w-full cursor-pointer text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3"
          >
            <img
              src="https://flagcdn.com/us.svg"
              alt="English"
              className="h-4 w-6 object-cover rounded-sm"
            />
            <span>English</span>
          </button>
          <button
            onClick={() => switchLanguage("ru")}
            className="w-full cursor-pointer text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3"
          >
            <img
              src="https://flagcdn.com/ru.svg"
              alt="Russian"
              className="h-4 w-6 object-cover rounded-sm"
            />
            <span>Русский</span>
          </button>
        </div>
      )}
    </div>
  );
};
