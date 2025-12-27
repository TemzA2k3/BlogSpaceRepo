import type {
    RequestMethod,
    ApiOptions
} from "@/shared/types/api-client.types"

import { API_BASE_URL } from "@/shared/constants/urls";

export async function apiRequest<T>(
    endpoint: string,
    method: RequestMethod = "GET",
    options: ApiOptions = {}
): Promise<T | null> {
    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string> || {}),
    };

    let body = options.body;

    if (!(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
        if (body && typeof body === "object") {
            body = JSON.stringify(body);
        }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body,
        credentials: "include",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Request error");
    }

    return response.status === 204 ? null : response.json();
}
