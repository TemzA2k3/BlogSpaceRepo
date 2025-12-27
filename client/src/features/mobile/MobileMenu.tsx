import { type FC, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAppSelector, useAppDispatch } from "@/hooks/redux/reduxHooks";

import { Button } from "@/shared/components/Button";
import { logout } from "@/store/slices/authSlice";
import { getAvatarUrl } from "@/shared/utils/getImagesUrls";

import type { MobileMenuProps } from "@/shared/types/mobile-menu.types";

interface NavLink {
    key: string;
    icon: string;
}

export const MobileMenu: FC<MobileMenuProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { currentUser } = useAppSelector((state) => state.auth);

    const links: NavLink[] = [
        { key: "posts", icon: "fa-newspaper" },
        { key: "articles", icon: "fa-book-open" },
        { key: "explore", icon: "fa-compass" },
        { key: "messages", icon: "fa-envelope" },
    ];

    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        dispatch(logout());
        onClose();
    };

    const handleProfileClick = () => {
        if (currentUser) {
            navigate(`/users/${currentUser.id}`);
            onClose();
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "hidden";
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "";
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    return (
        <>
            {/* Backdrop overlay */}
            <div
                className={`
                    fixed inset-0 bg-black/50 backdrop-blur-sm z-40
                    transition-opacity duration-300
                    ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
                `}
                onClick={onClose}
            />

            {/* Menu panel */}
            <div
                ref={menuRef}
                className={`
                    fixed top-0 left-0 h-screen w-72 bg-white dark:bg-gray-900 z-50 
                    shadow-2xl transform transition-transform duration-300 ease-out
                    flex flex-col
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <Link
                        to="/"
                        onClick={onClose}
                        className="flex items-center gap-2"
                    >
                        <div className="w-9 h-9 rounded-full bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center">
                            <i className="fa-solid fa-infinity text-white dark:text-neutral-900 text-sm" />
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            BlogSpace
                        </span>
                    </Link>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <i className="fa-solid fa-xmark text-lg" />
                    </button>
                </div>

                {/* User profile section (if logged in) */}
                {currentUser && (
                    <div
                        onClick={handleProfileClick}
                        className="p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={getAvatarUrl(
                                    currentUser.firstName,
                                    currentUser.lastName,
                                    currentUser.avatar
                                )}
                                alt={currentUser.userName}
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-white truncate">
                                    {currentUser.firstName} {currentUser.lastName}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {currentUser.userName}
                                </p>
                            </div>
                            <i className="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500" />
                        </div>
                    </div>
                )}

                {/* Navigation links */}
                <nav className="flex-1 p-3 overflow-y-auto">
                    <div className="space-y-1">
                        {links.map((link) => (
                            <Link
                                key={link.key}
                                to={`/${link.key}`}
                                className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                                onClick={onClose}
                            >
                                <i className={`fa-solid ${link.icon} w-5 text-center text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors`} />
                                <span>{t(`header.${link.key}`)}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Settings link (if logged in) */}
                    {currentUser && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Link
                                to={`/users/${currentUser.id}/settings`}
                                className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                                onClick={onClose}
                            >
                                <i className="fa-solid fa-gear w-5 text-center text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                                <span>{t("profile.settings")}</span>
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Footer actions */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    {currentUser ? (
                        <Button
                            variant="primary"
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors rounded-xl py-3"
                        >
                            <i className="fa-solid fa-right-from-bracket" />
                            {t("profile.logout")}
                        </Button>
                    ) : (
                        <div className="space-y-3">
                            <Link to="/signin" onClick={onClose} className="block">
                                <Button
                                    variant="secondary"
                                    className="w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-xl py-3"
                                >
                                    {t("header.signIn")}
                                </Button>
                            </Link>

                            <Link to="/signup" onClick={onClose} className="block">
                                <Button
                                    variant="primary"
                                    className="w-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors rounded-xl py-3 font-semibold"
                                >
                                    {t("header.signUp")}
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};