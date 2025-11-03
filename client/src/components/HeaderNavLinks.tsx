import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { menuElements } from "@/shared/constants/menuElements"

interface HeaderNavLinksProps {
  isMobile?: boolean;
}

export const HeaderNavLinks = ({ isMobile = false }: HeaderNavLinksProps) => {
  const { t } = useTranslation();

  return (
    <nav
      className={`
        ${isMobile ? "flex flex-col gap-4" : "flex items-center gap-2 sm:gap-4"}
      `}
    >
      {menuElements.map((link) => (
        <Link
          key={link}
          to={`/${link}`}
          className={`
            px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium 
            rounded-lg text-neutral-900 dark:text-neutral-100 
            hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200
          `}
        >
          {t(`header.${link}`)}
        </Link>
      ))}
    </nav>
  );
};
