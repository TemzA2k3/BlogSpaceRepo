import { apiRequest } from "../api/apiClient";

export const sendNewPassword = async (token: string, password: string) => {
    return apiRequest('/auth/reset-password/confirm', 'POST', {
        body: { token, password },
        credentials: 'include'
    });
};
