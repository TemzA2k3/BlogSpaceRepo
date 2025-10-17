import { API_BASE_URL } from "@/shared/constants/constants";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

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
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Request error");
  }

  return response.json();
}
