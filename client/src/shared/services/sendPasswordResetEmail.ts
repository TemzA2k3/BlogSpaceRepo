import { apiRequest } from "../api/apiClient";

export const sendPasswordResetEmail = async (email: string) => {
    try {
        await apiRequest(`/auth/reset-password`, "POST", {
            credentials: "include",
            body: { email } ,
        });
    } catch (err: any) {
        throw new Error(err?.message || "Something went wrong while sending reset email");
    }
};
