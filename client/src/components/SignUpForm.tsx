import { useTranslation } from "react-i18next";
import { Button } from "../shared/components/Button";

export const SignUpForm = () => {
  const { t } = useTranslation();
  const loading = false;

  return (
    <form className="space-y-5">
      {/* First Name */}
      <div>
        <label
          htmlFor="fname"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t("forms.fName")}
        </label>
        <input
          type="text"
          id="fname"
          autoComplete="fname"
          placeholder={t("forms.fNamePlaceholder")}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-100 transition-colors duration-300"
        />
      </div>

      {/* Last Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t("forms.lName")}
        </label>
        <input
          type="text"
          id="name"
          autoComplete="name"
          placeholder={t("forms.lNamePlaceholder")}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-100 transition-colors duration-300"
        />
      </div>

      {/* Email */}
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
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-100 transition-colors duration-300"
        />
      </div>

      {/* Password */}
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
          autoComplete="new-password"
          placeholder="********"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-100 transition-colors duration-300"
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirm-password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t("forms.confirmPassword")}
        </label>
        <input
          type="password"
          id="confirm-password"
          autoComplete="new-password"
          placeholder="********"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-100 transition-colors duration-300"
        />
      </div>

      {/* Submit Button */}
      <Button
        disabled={loading}
        className="w-full py-2 mt-2 text-white bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-300"
      >
        {loading ? (
          <>
            <i className="fa fa-spinner fa-spin mr-2" /> {t("forms.processingSignUp")}
          </>
        ) : (
          t("header.signUp")
        )}
      </Button>
    </form>
  );
};
