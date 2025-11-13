import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import alertReducer from "./slices/alertSlice"
import postReducer from "./slices/postSlice";
import articlesSlice from "./slices/articleSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    alert: alertReducer,
    articles: articlesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
