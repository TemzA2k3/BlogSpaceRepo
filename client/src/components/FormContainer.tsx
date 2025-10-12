import type { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface IFormContainer {
  isShowLogo?: boolean;
  title: string;
  label?: string;
  isShowAuthLabel?: boolean;
  isSignInForm?: boolean;
  children: ReactNode;
}

export const FormContainer: FC<IFormContainer> = ({
  isShowLogo = true,
  title,
  label,
  isShowAuthLabel = true,
  isSignInForm = true,
  children
}) => {
  const { t } = useTranslation();

  const authText = isSignInForm
    ? { text: t('auth.unauthorizedUserText'), linkText: t('header.signUp'), linkTo: "/signup" }
    : { text: t('auth.authorizedUserText'), linkText: t('header.signIn'), linkTo: "/signin" };

  return (
    <section className="flex items-center justify-center py-12 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-md bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors duration-300">
        {/* Логотип */}
        {isShowLogo && (
          <div className="text-center">
            <Link to="/" className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="logo-icon w-10 h-10 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center">
                <i className="fas fa-infinity text-sm"></i>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">BlogSpace</h1>
            </Link>
          </div>
        )}

        {/* Заголовок и описание */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{title}</h2>
          {label && <p className="text-sm text-gray-500 dark:text-gray-300">{label}</p>}
        </div>

        {/* Форма */}
        {children}

        {/* Ссылка на регистрацию/вход */}
        {isShowAuthLabel && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-300 mt-6">
            {authText.text}{" "}
            <Link to={authText.linkTo} className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              {authText.linkText}
            </Link>
          </p>
        )}
      </div>
    </section>
  );
};
