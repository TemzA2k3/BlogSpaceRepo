import { type FC, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/Button";
import { useAppSelector, useAppDispatch } from "@/hooks/reduxHooks";
import { logout } from "@/store/slices/authSlice";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);

  const links = ["posts", "articles", "explore", "messages"];

  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    onClose();
  };

  // Закрытие при клике вне меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={menuRef}
      className={`
        fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 z-50 shadow-lg
        transform transition-transform duration-300 flex flex-col justify-between
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Верхняя часть — навигация */}
      <div className="p-6 flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link}
            to={`/${link}`}
            className="px-3 py-2 text-base font-medium rounded-lg text-neutral-900 dark:text-neutral-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={onClose}
          >
            {t(`header.${link}`)}
          </Link>
        ))}
      </div>

      {/* Нижняя часть — кнопки авторизации / выхода */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-3">
        {currentUser ? (
          <Button
            variant="primary"
            onClick={handleLogout}
            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-lg"
          >
            {t("profile.logout")}
          </Button>
        ) : (
          <>
            <Link to="/signin" onClick={onClose}>
              <Button
                variant="secondary"
                className="w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-lg"
              >
                {t("header.signIn")}
              </Button>
            </Link>

            <Link to="/signup" onClick={onClose}>
              <Button
                variant="primary"
                className="w-full bg-blue-600 dark:bg-gray-700 text-white dark:text-white hover:bg-blue-700 dark:hover:bg-gray-600 transition-colors rounded-lg"
              >
                {t("header.signUp")}
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
