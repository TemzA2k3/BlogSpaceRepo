import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";

import { useAppDispatch, useAppSelector } from "@/hooks/redux/reduxHooks";
import { register, clearAuthStatus } from "@/store/slices/authSlice";
import { Button } from "@/shared/components/Button";
import { useAlert } from "@/app/providers/alert/AlertProvider";
import { initialSignUpValues, getValidationSignUpSchema } from "@/shared/utils/authValidation";

export const SignUpForm = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { loading, error, success } = useAppSelector((state) => state.auth);
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const validationSchema = getValidationSignUpSchema(t);

    const formik = useFormik({
        initialValues: initialSignUpValues,
        validationSchema,
        onSubmit: (values) => {
            dispatch(register({
                firstName: values.fname,
                lastName: values.lname,
                email: values.email,
                password: values.password,
            }));
        },
    });

    useEffect(() => {
        if (error) showAlert(error, "error");
        else if (success) {
            showAlert(t("forms.registrationSuccess"), "success");
            navigate("/signin")
        }

        if (error || success) dispatch(clearAuthStatus());
    }, [error, success, showAlert, dispatch, t]);

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
                <label htmlFor="fname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("forms.fName")}
                </label>
                <input
                    type="text"
                    id="fname"
                    name="fname"
                    placeholder={t("forms.fNamePlaceholder")}
                    value={formik.values.fname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg text-sm transition-colors duration-300 
            ${formik.touched.fname && formik.errors.fname
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                        } bg-gray-50 dark:bg-gray-700 dark:text-gray-100`}
                />
                {formik.touched.fname && formik.errors.fname && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.fname}</div>
                )}
            </div>

            <div>
                <label htmlFor="lname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("forms.lName")}
                </label>
                <input
                    type="text"
                    id="lname"
                    name="lname"
                    placeholder={t("forms.lNamePlaceholder")}
                    value={formik.values.lname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg text-sm transition-colors duration-300 
            ${formik.touched.lname && formik.errors.lname
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                        } bg-gray-50 dark:bg-gray-700 dark:text-gray-100`}
                />
                {formik.touched.lname && formik.errors.lname && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.lname}</div>
                )}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("forms.email")}
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg text-sm transition-colors duration-300 
            ${formik.touched.email && formik.errors.email
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                        } bg-gray-50 dark:bg-gray-700 dark:text-gray-100`}
                />
                {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                )}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("forms.password")}
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="********"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg text-sm transition-colors duration-300 
            ${formik.touched.password && formik.errors.password
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                        } bg-gray-50 dark:bg-gray-700 dark:text-gray-100`}
                />
                {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                )}
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("forms.confirmPassword")}
                </label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="********"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg text-sm transition-colors duration-300 
            ${formik.touched.confirmPassword && formik.errors.confirmPassword
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                        } bg-gray-50 dark:bg-gray-700 dark:text-gray-100`}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</div>
                )}
            </div>

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
