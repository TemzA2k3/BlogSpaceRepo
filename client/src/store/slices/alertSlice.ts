import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";


type AlertState = {
  message: string | null;
  type: "success" | "error";
};

const initialState: AlertState = {
  message: null,
  type: "success",
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    showAlert: (state, action: PayloadAction<{ message: string; type?: "success" | "error" }>) => {
      state.message = action.payload.message;
      state.type = action.payload.type || "success";
    },
    hideAlert: (state) => {
      state.message = null;
    },
  },
});

export const { showAlert, hideAlert } = alertSlice.actions;
export default alertSlice.reducer;
