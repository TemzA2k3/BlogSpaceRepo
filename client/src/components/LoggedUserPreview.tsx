import { useRef, useState, type FC, useEffect } from "react";
import { type User } from "@/store/slices/authSlice";

interface ILoggedUserPreview {
    handleLogout: () => void;
    user: User;
}

export const LoggedUserPreview: FC<ILoggedUserPreview> = ({ handleLogout, user }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowUserDropdown(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const avatarUrl = user.avatar
        ? user.avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&background=gray&color=fff&rounded=true&size=32`;

    return (
        <div ref={wrapperRef} className="relative flex">
            <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="p-0 transition-transform duration-200 hover:scale-105"
            >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center overflow-hidden shadow-md">
                    <img src={avatarUrl} alt={user.firstName + ' ' + user.lastName} className="w-full h-full object-cover" />
                </div>
            </button>

            {showUserDropdown && (
                <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-10 min-w-[160px] sm:min-w-[200px] overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                            <img src={user.avatar || avatarUrl} alt={user.email} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col text-xs sm:text-sm">
                            <span className="font-semibold text-gray-800 dark:text-gray-100">{user.firstName} {user.lastName}</span>
                            <span className="text-gray-500 dark:text-gray-300">{user.email}</span>
                        </div>
                    </div>

                    <button className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm flex items-center gap-2 sm:gap-3 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                        <i className="fas fa-user text-xs sm:text-sm text-gray-600 dark:text-gray-300"></i>
                        Profile
                    </button>

                    <button
                        onClick={() => {
                            handleLogout();
                            setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm flex items-center gap-2 sm:gap-3 font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-700 transition-colors duration-150"
                    >
                        <i className="fas fa-sign-out-alt text-xs sm:text-sm"></i>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};
