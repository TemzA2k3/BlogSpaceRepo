import { type Middleware } from "@reduxjs/toolkit";

import { logout } from "@/store/slices/authSlice";

interface RejectedAction {
  type: string;
  error?: {
    message?: string;
    status?: number;
  };
}

export const authMiddleware: Middleware = storeAPI => next => (action: unknown) => {
  const result = next(action);

  const act = action as RejectedAction;

  if (act.type?.endsWith("/rejected") && act.error?.status === 401) {
    //TODO потом посмотреть как сделать без any
    storeAPI.dispatch(logout() as any);
  }

  return result;
};
