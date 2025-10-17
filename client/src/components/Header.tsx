import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { HeaderNavLinks } from "./HeaderNavLinks";
import { ToggleTheme } from "./ToogleTheme";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Notifications } from "./Notifications";
import { LoggedUserPreview } from "./LoggedUserPreview";

import { Button } from "@/shared/components/Button";

export const Header = () => {
    const { t } = useTranslation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <header
            className="
        flex items-center justify-between px-10 py-3 border-b 
        border-gray-200 dark:border-gray-700 
        bg-white dark:bg-gray-900 
        text-gray-800 dark:text-gray-100 
        transition-colors duration-300
      "
        >
            <div className="flex justify-between w-full items-center">
                {/* Навигация */}
                <HeaderNavLinks />

                {/* Правая часть */}
                <div className="flex items-center gap-4">
                    {/* Переключатель темы */}
                    <ToggleTheme />

                    {/* Переключатель языка */}
                    <LanguageSwitcher />

                    {/* Уведомления */}
                    <Notifications />

                    {/* Авторизация */}
                    {isLoggedIn ? (
                        <LoggedUserPreview setIsLoggedIn={() => setIsLoggedIn(false)} />
                    ) : (
                        <div className="flex gap-3">
                            <Link to="/signin">
                                <Button
                                    variant="secondary"
                                    className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    {t("header.signIn")}
                                </Button>
                            </Link>

                            <Link to="/signup">
                                <Button
                                    variant="primary"
                                    className="bg-blue-600 text-white 
                                                dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 
                                                transition-colors">
                                    {t("header.signUp")}
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
