import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { apiRequest } from "../../shared/api/apiClient";

interface SendUserData { 
    firstName: string; 
    lastName: string; 
    email: string; 
    password: string 
}

interface User {
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: Cookies.get("token") || null,
  loading: false,
  success: false,
  error: null,
};

// ==== LOGIN ====
export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await apiRequest<{ user: User; token: string }>("/login", "POST", {
        body: { email, password },
      });

      // сохраняем токен в cookies
      Cookies.set("token", data.token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка входа");
    }
  }
);

// ==== REGISTER ====
export const register = createAsyncThunk(
  "auth/register",
  async (
    {
      firstName,
      lastName,
      email,
      password,
    }: SendUserData,
    { rejectWithValue }
  ) => {
    console.log(firstName, lastName, email, password);
    
    try {
      const data = await apiRequest<{ user: User; token: string }>("/auth/register", "POST", {
        body: { firstName, lastName, email, password },
      });

      Cookies.set("token", data.token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка регистрации");
    }
  }
);

// ==== SLICE ====
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      Cookies.remove("token");
    },
    clearAuthStatus(state) {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.success = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // REGISTER
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(register.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.success = true;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout, clearAuthStatus } = authSlice.actions;
export default authSlice.reducer;
