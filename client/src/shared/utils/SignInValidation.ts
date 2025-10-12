import * as Yup from "yup";

export const initialValues = {
  email: "",
  password: "",
  rememberMe: false,
};

const minPassLength = 6;

export const getValidationSchema = (t: (key: string, options?: any) => string) => {
  return Yup.object({
    email: Yup.string()
      .email(t("forms.invalidEmail"))
      .required(t("forms.required")),
    password: Yup.string()
      .min(minPassLength, t("forms.passwordMinLength", { count: minPassLength }))
      .required(t("forms.required")),
  });
};
