import { Link } from "react-router-dom";
import { Button } from "../shared/components/Button";
import { useTranslation } from "react-i18next";

export const SignInForm = () => {
  const { t } = useTranslation();
  const loading = false;

  return (
    <form className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t("forms.email")}
        </label>
        <input
          type="email"
          id="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t("forms.password")}
        </label>
        <input
          type="password"
          id="password"
          autoComplete="current-password"
          placeholder="********"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            className="w-4 h-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500"
          />
          {t("forms.rememberMe")}
        </label>
        <Link
          to="/forgot-password"
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          {t("forms.forgotPassword")}
        </Link>
      </div>

      <Button
        disabled={loading}
        className="w-full py-2 mt-2 text-white bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-300"
      >
        {loading ? (
          <>
            <i className="fa fa-spinner fa-spin mr-2" /> {t("forms.processingSignIn")}
          </>
        ) : (
          t("header.signIn")
        )}
      </Button>
    </form>
  );
};
