import type { FC } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Footer: FC = () => {
    const { t } = useTranslation();

    const FOOTER_LINKS = [
        {
            id: 1,
            text: t("footer.home"),
            link: "/"
        },
        {
            id: 2,
            text: t("footer.explore"),
            link: "/explore"
        },
        {
            id: 3,
            text: t("footer.about"),
            link: "/about"
        },
        {
            id: 4,
            text: t("footer.contact"),
            link: "/contact"
        }
    ]

    return (
        <footer className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-6 sm:px-10 py-10 border-t border-[#E5E8EB] dark:border-gray-700 transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 flex items-center justify-center">
                            <i className="fas fa-infinity text-sm"></i>
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold">BlogSpace</h2>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm max-w-xs">
                        {t("footer.label")}
                    </p>
                </div>

                <nav className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 items-start">
                    {FOOTER_LINKS.map((item) => (
                        <Link
                            key={item.id}
                            to={item.link}
                            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 hover:scale-105 text-sm sm:text-base font-medium"
                        >
                            {item.text}
                        </Link>
                    ))}
                </nav>

                <div className="flex flex-col gap-4 items-center md:items-end">
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-semibold">{t("footer.follow")}</span>
                    <div className="flex gap-3 justify-center">
                        {["facebook", "twitter", "instagram"].map((icon) => (
                            <a
                                key={icon}
                                href="#"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                                <i className={`fab fa-${icon} text-gray-900 dark:text-gray-100`}></i>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-10 border-t border-gray-300 dark:border-gray-700 pt-4 text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm transition-colors duration-300">
                {t("footer.copyright", { year: new Date().getFullYear() })}
            </div>
        </footer>
    );
};
