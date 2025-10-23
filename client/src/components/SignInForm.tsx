import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { login, clearAuthStatus } from "@/store/slices/authSlice";
import { getValidationSignInSchema, initialSignInValues } from "@/shared/utils/authValidation";
import { Button } from "@/shared/components/Button";
import { useAlert } from "@/app/providers/alert/AlertProvider";

export const SignInForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useAppSelector((state) => state.auth);
  const { showAlert } = useAlert();

  const validationSchema = getValidationSignInSchema(t);

  const formik = useFormik({
    initialValues: initialSignInValues,
    validationSchema,
    onSubmit: (values) => {
      dispatch(
        login({
          email: values.email,
          password: values.password,
          remember: values.remember,
        })
      );
    },
  });

  useEffect(() => {
    dispatch(clearAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!error && !success) return;

    if (error) showAlert(error, "error");
    else if (success) {
      showAlert(t("forms.loginSuccess"), "success");
      navigate("/");
    }

    dispatch(clearAuthStatus());
  }, [error, success, showAlert, t, dispatch, navigate]);

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-5 max-w-md mx-auto w-full px-4 sm:px-6 lg:px-0"
    >
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
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-100 transition-colors duration-300"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
        )}
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
          name="password"
          autoComplete="current-password"
          placeholder="********"
          value={formik.values.password}
          onChange={formik.handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-100 transition-colors duration-300"
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            name="remember"
            checked={formik.values.remember}
            onChange={formik.handleChange}
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

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full py-2 mt-2 text-white bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2"
      >
        {loading && <i className="fa fa-spinner fa-spin" />}
        {loading ? t("forms.processingSignIn") : t("header.signIn")}
      </Button>
    </form>
  );
};
