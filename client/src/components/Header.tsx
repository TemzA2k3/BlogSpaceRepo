import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { Button } from "@/shared/components/Button";
import { logout, clearAuthStatus } from "@/store/slices/authSlice";
import { useAlert } from "@/app/providers/alert/AlertProvider";

import { HeaderNavLinks } from "./HeaderNavLinks";
import { ToggleTheme } from "./ToogleTheme";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Notifications } from "./Notifications";
import { LoggedUserPreview } from "./LoggedUserPreview";
import { MobileMenu } from "./MobileMenu";

export const Header = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { currentUser, error, success } = useAppSelector((state) => state.auth);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => dispatch(logout());

  useEffect(() => {
    if (!error && !success) return;

    if (error) showAlert(error, "error");
    else if (success && !currentUser) {
      showAlert(t("forms.logoutSuccess"), "success");
      navigate("/");
    }

    dispatch(clearAuthStatus());
  }, [error, success, currentUser, showAlert, t, navigate]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Левая зона: гамбургер + лого */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Бургер только на <890px */}
          <button
            className="md2:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={toggleMobileMenu}
          >
            <i className="fas fa-bars text-lg"></i>
          </button>

          {/* Лого и название видны при ≥890px */}
          <Link to="/" className="hidden md2:flex items-center gap-2">
            <div className="logo-icon w-10 h-10 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center">
              <i className="fas fa-infinity text-sm"></i>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100">
              BlogSpace
            </h1>
          </Link>
        </div>

        {/* Центральная зона: ссылки навигации на sm+ */}
        <nav className="flex-1 hidden md2:flex justify-center">
          <HeaderNavLinks />
        </nav>

        {/* Правая зона: кнопки/аватар + настройки */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <ToggleTheme />
          <LanguageSwitcher />
          <Notifications />

          {currentUser ? (
            <LoggedUserPreview handleLogout={handleLogout} user={currentUser} />
          ) : (
            <div className="hidden md2:flex gap-2 sm:gap-3">
              <Link to="/signin">
                <Button
                  variant="secondary"
                  className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-lg"
                >
                  {t("header.signIn")}
                </Button>
              </Link>

              <Link to="/signup">
                <Button
                  variant="primary"
                  className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-blue-600 dark:bg-gray-700 text-white dark:text-white dark:hover:bg-gray-600 transition-colors rounded-lg"
                >
                  {t("header.signUp")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Мобильное меню */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </header>
  );
};
