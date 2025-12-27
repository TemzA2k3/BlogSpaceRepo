import { apiRequest } from "@/shared/api/apiClient";

export type ContactSubject = 
    | "general"
    | "technical"
    | "billing"
    | "partnership"
    | "feedback"
    | "other";

export interface CreateContactMessagePayload {
    name: string;
    email: string;
    subject: ContactSubject;
    message: string;
}

export const sendContactMessage = async (data: CreateContactMessagePayload): Promise<void> => {
    await apiRequest("/contact", "POST", {
        body: data,
    });
};