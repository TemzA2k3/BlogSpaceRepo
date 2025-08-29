import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


export const HeaderNavLinks = () => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-8 items-center">
      <Link 
        className="flex gap-4 items-center"
        to="/">
        <div className="logo-icon w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center">
          <i className="fas fa-infinity text-sm"></i>
        </div>
        <h1
          data-lang-key="app-name"
          className="justify-start text-neutral-900 text-lg font-bold leading-snug"
        >
          BlogSpace
        </h1>
      </Link>
      <nav className="max-w-4xl mx-auto px-4 py-4 flex gap-4">
        <div className="inline-flex justify-start items-center gap-9">
          <div className="inline-flex flex-col justify-start items-start">
            <Link
              className="self-stretch justify-start text-neutral-900 text-sm font-medium leading-tight px-2 py-1 rounded-lg transition-colors duration-200 hover:scale-105"
              to="/"
            >
              {t("header.home")}
            </Link>
          </div>
          <div className="inline-flex flex-col justify-start items-start">
            <Link
              className="self-stretch justify-start text-neutral-900 text-sm font-medium leading-tight px-2 py-1 rounded-lg transition-colors duration-200 hover:scale-105"
              to="/"
            >
              {t("header.explore")}
            </Link>
          </div>
          <div className="inline-flex flex-col justify-start items-start">
            <Link
              className="self-stretch justify-start text-neutral-900 text-sm font-medium leading-tight px-2 py-1 rounded-lg transition-colors duration-200 hover:scale-105"
              to="/"
            >
              {t("header.notifications")}
            </Link>
          </div>
          <div className="inline-flex flex-col justify-start items-start">
            <Link
              className="self-stretch justify-start text-neutral-900 text-sm font-medium leading-tight px-2 py-1 rounded-lg transition-colors duration-200 hover:scale-105"
              to="/"
            >
              {t("header.messages")}
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};
