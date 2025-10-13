import * as Yup from "yup";

export const initialValues = {
  email: "",
  password: "",
  rememberMe: false,
};

const minPassLength = 6;

export const getValidationSchema = (t: (key: string, options?: any) => string) => {
  return Yup.object({
    fname: Yup.string()
      .trim()
      .min(2, t("validation.minLength", { count: 2 }))
      .required(t("validation.required")),
    lname: Yup.string()
      .trim()
      .min(2, t("validation.minLength", { count: 2 }))
      .required(t("validation.required")),
    email: Yup.string()
      .email(t("validation.invalidEmail"))
      .required(t("validation.required")),
    password: Yup.string()
      .min(6, t("validation.passwordShort"))
      .required(t("validation.required")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], t("validation.passwordMismatch"))
      .required(t("validation.required")),
  })
}