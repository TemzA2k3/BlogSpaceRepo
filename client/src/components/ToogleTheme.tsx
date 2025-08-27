import { useState } from "react";


export const ToggleTheme = () => {

    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => {
      setIsDark(!isDark)
      if (!isDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }

    return (
        <button
            onClick={toggleTheme}
            className="w-10 h-10 bg-white rounded-xl cursor-pointer border border-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 active:rotate-180"
          >
            <i
              className={`fas ${
                isDark ? "fa-sun text-gray-700" : "fa-moon text-gray-600"
              } text-sm transition-transform duration-300`}
            ></i>
          </button>
    )
}