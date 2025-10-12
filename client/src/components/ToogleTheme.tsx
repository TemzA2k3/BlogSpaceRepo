import { useEffect, useState } from "react";

export const ToggleTheme = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Проверяем сохранённую тему
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") return true;
    if (savedTheme === "light") return false;

    // Если темы нет в localStorage — проверяем системные настройки
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Применяем тему при монтировании и при изменении isDark
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <button
      onClick={toggleTheme}
      className="
        w-10 h-10 
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700 
        rounded-xl 
        cursor-pointer 
        flex items-center justify-center 
        transition-all duration-300 
        hover:scale-105 active:scale-95
      "
    >
      <i
        className={`fas ${
          isDark ? "fa-sun text-yellow-400" : "fa-moon text-gray-600"
        } text-sm transition-transform duration-300`}
      ></i>
    </button>
  );
};
