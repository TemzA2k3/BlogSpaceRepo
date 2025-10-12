import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

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
  token: null,
  loading: false,
  success: false,
  error: null,
};

// Асинхронный логин
export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch("https://example.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || "Ошибка входа");
      return data; // { user, token }
    } catch (err) {
      console.log(err);
      return rejectWithValue("Ошибка сети");
    }
  }
);

// Асинхронная регистрация
export const register = createAsyncThunk(
  "auth/register",
  async (
    {
      fname,
      lname,
      email,
      password,
    }: { fname: string; lname: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch("https://example.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fname, lname, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || "Ошибка регистрации");
      return data; // { user, token }
    } catch (err) {
      console.log(err);
      return rejectWithValue("Ошибка сети");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
    },
    clearAuthStatus(state) {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      login.fulfilled,
      (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.success = true;
      }
    );
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      register.fulfilled,
      (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.success = true;
      }
    );
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout, clearAuthStatus } = authSlice.actions;
export default authSlice.reducer;
