import { ApiError } from "./apiError";
import { API_BASE_URL } from "@/shared/constants/constants";

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiOptions extends RequestInit {
  body?: any;
  auth?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  method: RequestMethod = "GET",
  options: ApiOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  let body = options.body;

  // ✅ если это не FormData, добавляем заголовок и сериализуем в JSON
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
    throw new ApiError(errorData.message || "Request error", response.status);
  }

  return response.json();
}
