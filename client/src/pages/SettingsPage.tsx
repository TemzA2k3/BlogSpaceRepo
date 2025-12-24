import { useState, useEffect, type FC } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAppSelector } from "@/hooks/redux/reduxHooks";
import { getAvatarUrl } from "@/shared/utils/getImagesUrls";

import { useSettings } from "@/hooks/settings/useSettings";

import { ProfileSettings } from "@/features/settings/sections/ProfileSettings";
import { AccountSettings } from "@/features/settings/sections/AccountSettings";
import { PrivacySettings } from "@/features/settings/sections/PrivacySettings";
import { LanguageSettings } from "@/features/settings/sections/LanguageSettings";

import { Loader } from "@/shared/components/Loader";

type SettingsSection = "profile" | "account" | "privacy" | "language";

interface SettingsMenuItem {
    id: SettingsSection;
    label: string;
    icon: string;
}

const VALID_SECTIONS: SettingsSection[] = ["profile", "account", "privacy", "language"];

const isValidSection = (hash: string): hash is SettingsSection => {
    return VALID_SECTIONS.includes(hash as SettingsSection);
};

export const SettingsPage: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAppSelector((state) => state.auth);

    const { settings, loading, updating, updateSettings, updateSetting } = useSettings();

    const getInitialSection = (): SettingsSection => {
        const hash = location.hash.replace("#", "");
        return isValidSection(hash) ? hash : "profile";
    };

    const [activeSection, setActiveSection] = useState<SettingsSection>(getInitialSection);

    const menuItems: SettingsMenuItem[] = [
        { id: "profile", label: "My Profile", icon: "fa-user" },
        { id: "account", label: "Account", icon: "fa-shield-halved" },
        { id: "privacy", label: "Privacy & Security", icon: "fa-lock" },
        { id: "language", label: "Language", icon: "fa-globe" },
    ];

    useEffect(() => {
        const hash = location.hash.replace("#", "");
        if (isValidSection(hash) && hash !== activeSection) {
            setActiveSection(hash);
        }
    }, [location.hash]);

    const handleSectionChange = (section: SettingsSection) => {
        setActiveSection(section);
        navigate(`#${section}`, { replace: true });
    };

    const renderSectionContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-20">
                    <Loader />
                </div>
            );
        }

        if (!settings) return null;

        switch (activeSection) {
            case "profile":
                return (
                    <ProfileSettings
                        settings={settings}
                        updating={updating}
                        onUpdate={updateSettings}
                    />
                );
            case "account":
                return <AccountSettings />;
            case "privacy":
                return (
                    <PrivacySettings
                        settings={settings}
                        updating={updating}
                        onUpdate={updateSetting}
                    />
                );
            case "language":
                return (
                    <LanguageSettings
                        settings={settings}
                        updating={updating}
                        onUpdate={updateSetting}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar */}
                <aside className="w-full lg:w-72 shrink-0">
                    <div className="bg-white dark:bg-darkbg border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
                        {/* User Preview */}
                        <div
                            className="p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => navigate(`/users/${currentUser?.id}`)}
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={getAvatarUrl(
                                        currentUser?.firstName || "",
                                        currentUser?.lastName || "",
                                        currentUser?.avatar
                                    )}
                                    alt={currentUser?.userName}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                        {currentUser?.firstName} {currentUser?.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        {currentUser?.userName}
                                    </p>
                                </div>
                                <i className="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500" />
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="p-2">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleSectionChange(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                                        activeSection === item.id
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                                >
                                    <i
                                        className={`fa-solid ${item.icon} w-5 text-center ${
                                            activeSection === item.id
                                                ? "text-white"
                                                : "text-gray-500 dark:text-gray-400"
                                        }`}
                                    />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Content Panel */}
                <section className="flex-1">
                    <div className="bg-white dark:bg-darkbg border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
                        {renderSectionContent()}
                    </div>
                </section>
            </div>
        </main>
    );
};
