import type { ReactNode } from "react";

export interface IFormContainer {
    isShowLogo?: boolean;
    title: string;
    label?: string;
    isShowAuthLabel?: boolean;
    isSignInForm?: boolean;
    children: ReactNode;
  }