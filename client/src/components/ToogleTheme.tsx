import { useTheme } from "@/app/providers/theme/ThemeProvider";

export const ToggleTheme = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        w-8 h-8 sm:w-10 sm:h-10
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700 
        rounded-xl 
        flex items-center justify-center 
        transition-transform duration-300 hover:scale-105 active:scale-95
      "
    >
      <i
        className={`fas ${isDark ? "fa-sun text-yellow-400" : "fa-moon text-gray-600"} text-sm sm:text-base transition-transform duration-300`}
      ></i>
    </button>
  );
};
