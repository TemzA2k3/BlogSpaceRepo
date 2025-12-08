import { apiRequest } from "@/shared/api/apiClient";

import type { User } from "@/shared/types/user.types"

export const changeUserAvatar = async (file: File): Promise<User> => {

    const formData = new FormData();
    formData.append("avatar", file);

    try {
        const data = await apiRequest<User>(`/users/avatar`, "PATCH", {
            credentials: "include",
            body: formData,
        });

        return data;
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong...")
    }
}