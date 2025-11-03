import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import alertReducer from "./slices/alertSlice"
import postReducer from "./slices/postSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    alert: alertReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
