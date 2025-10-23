import { type FC } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const links = ["posts", "articles", "explore", "messages"];

  return (
    <>
      {/* Затемнение фона */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      ></div>

      {/* Сайдбар */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 z-50 shadow-lg
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
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
      </div>
    </>
  );
};
