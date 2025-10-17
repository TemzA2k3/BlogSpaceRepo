import * as Yup from "yup";

const minPassLength = 6;
const minNameLength = 2;

export const initialSignInValues = {
    email: "",
    password: "",
    remember: false,
};

export const initialSignUpValues = {
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
}

export const getValidationSignInSchema = (t: (key: string, options?: any) => string) => {
  return Yup.object({
    email: Yup.string()
      .email(t("forms.invalidEmail"))
      .required(t("forms.required")),
    password: Yup.string()
      .min(minPassLength, t("forms.passwordMinLength", { count: minPassLength }))
      .required(t("forms.required")),
  });
};

export const getValidationSignUpSchema = (t: (key: string, options?: any) => string) => {
    return Yup.object({
      fname: Yup.string()
        .trim()
        .min(minNameLength, t("forms.nameMinLength", { count: minNameLength }))
        .required(t("forms.required")),
      lname: Yup.string()
        .trim()
        .min(minNameLength, t("forms.nameMinLength", { count: minNameLength }))
        .required(t("forms.required")),
      email: Yup.string()
        .email(t("forms.invalidEmail"))
        .required(t("forms.required")),
      password: Yup.string()
        .min(minPassLength, t("forms.passwordMinLength", { count: minPassLength }))
        .required(t("forms.required")),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], t("forms.passwordMismatch"))
        .required(t("forms.required")),
    })
  }
