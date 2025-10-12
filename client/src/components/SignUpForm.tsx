import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { register } from "../store/slices/authSlice";
import { Button } from "../shared/components/Button";

export const SignUpForm = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert(t("forms.passwordMismatch"));
      return;
    }
    dispatch(register({ fname, lname, email, password }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="text-red-500 text-sm">{error}</p>}

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
          value={fname}
          onChange={(e) => setFname(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-100 transition-colors duration-300"
        />
      </div>

      {/* Last Name */}
      <div>
        <label
          htmlFor="lname"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t("forms.lName")}
        </label>
        <input
          type="text"
          id="lname"
          autoComplete="lname"
          placeholder={t("forms.lNamePlaceholder")}
          value={lname}
          onChange={(e) => setLname(e.target.value)}
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-100 transition-colors duration-300"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
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
