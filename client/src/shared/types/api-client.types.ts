export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiOptions extends RequestInit {
    body?: any;
    auth?: boolean;
}
