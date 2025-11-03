import { API_BASE_URL } from "@/shared/constants/urls";

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiOptions extends RequestInit {
  body?: any;
  auth?: boolean;
}

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

  if (response.status === 401) {
    // Лениво импортируем store только здесь потому что иначе будет циклическая зависимость
    const { store } = await import("@/store/store");
    const { logout } = await import("@/store/slices/authSlice");
    
    store.dispatch(logout());
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Request error");
  }

  return response.status === 204 ? null : response.json();
}
