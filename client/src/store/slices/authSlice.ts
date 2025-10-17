import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

import { apiRequest } from "@/shared/api/apiClient";

interface SendUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface User {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    role: string;
    avatar: string | null;
    isBlocked: boolean;
}

interface LoginUserData {
  email: string;
  password: string;
  remember: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  success: false,
  error: null,
};

// ==== LOGIN ====
export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password, remember }: LoginUserData,
    { rejectWithValue }
  ) => {
    try {
      const data = await apiRequest<{ user: User }>("/auth/login", "POST", {
        body: { email, password, remember },
        credentials: "include",
      });

      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Login error");
    }
  }
);

// ==== REGISTER ====
export const register = createAsyncThunk(
    "auth/register",
    async (
      { firstName, lastName, email, password }: SendUserData,
      { rejectWithValue }
    ) => {
      try {
        const data = await apiRequest<{ user: LoginUserData }>("/auth/register", "POST", {
          body: { firstName, lastName, email, password },
          credentials: "include",
        });
  
        return data;
      } catch (err: any) {
        return rejectWithValue(err.message || "Registration error");
      }
    }
);


export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
        await apiRequest("/auth/logout", "POST", {
            credentials: "include", // чтобы cookie ушли на сервер
        });
        return true; // просто возвращаем успех
        } catch (err: any) {
        return rejectWithValue(err.message || "Logout error");
        }
    }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthStatus(state) {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.success = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // LOGOUT
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.success = true;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAuthStatus } = authSlice.actions;
export default authSlice.reducer;
