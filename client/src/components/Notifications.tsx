import type { FC } from "react";
import { useState, useRef, useEffect } from "react";

export const Notifications: FC = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const notifications = [
    { id: 1, user: "Иван Петров", avatar: "https://i.pravatar.cc/40?img=1", action: "подписался на вас", time: "2 мин назад" },
    { id: 2, user: "Мария Соколова", avatar: "https://i.pravatar.cc/40?img=2", action: "лайкнула ваш пост", time: "10 мин назад" },
    { id: 3, user: "Алексей Иванов", avatar: "https://i.pravatar.cc/40?img=3", action: "оставил комментарий: «Отличная работа!»", time: "1 час назад" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl cursor-pointer border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <i className="fas fa-bell text-gray-600 dark:text-gray-300 text-sm"></i>
      </button>

      {notifications.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
          {notifications.length}
        </span>
      )}

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden animate-fadeIn z-50">
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <img
                  src={n.avatar}
                  alt={n.user}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    <span className="font-semibold">{n.user}</span> {n.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 text-center">
            <button className="w-full py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer">
              Показать все уведомления
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
