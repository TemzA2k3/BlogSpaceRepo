import { configureStore } from "@reduxjs/toolkit";

import { authMiddleware } from "@/store/middlewares/authMiddleware"

import authReducer from "./slices/authSlice";
import alertReducer from "./slices/alertSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    alert: alertReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
