import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

import { apiRequest } from "@/shared/api/apiClient";

import type {
    User,
    RegisterUserData,
    LoginUserData,
    AuthState
} from "@/shared/types/userTypes"



const initialState: AuthState = {
    currentUser: JSON.parse(localStorage.getItem("currentUser") || "null"),
    loading: false,
    success: false,
    error: null,
};

export const login = createAsyncThunk(
    "auth/login",
    async (
        { email, password, remember }: LoginUserData,
        { rejectWithValue }
    ) => {
        try {
            const data = await apiRequest<User>("/auth/login", "POST", {
                body: { email, password, remember },
                credentials: "include",
            });
            
            return data;
        } catch (err: any) {
            return rejectWithValue(err.message || "Login error");
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async (
        { firstName, lastName, email, password }: RegisterUserData,
        { rejectWithValue }
    ) => {
        try {
            const data = await apiRequest<User>("/auth/register", "POST", {
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
            const response = await apiRequest("/auth/logout", "POST", {
                credentials: "include",
            });
            return response;
        } catch (err: any) {
            return rejectWithValue(err.message || "Logout error");
        }
    }
);

export const getMe = createAsyncThunk(
    "auth/getMe",
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiRequest<User>("/auth/me", "GET", {
                credentials: "include",
            });

            return data;
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong...")
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<User>) => {
            state.currentUser = action.payload;
            localStorage.setItem("currentUser", JSON.stringify(action.payload));
          },
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
            .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.currentUser = action.payload;
                state.success = true;

                localStorage.setItem("currentUser", JSON.stringify(action.payload));
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
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = null;
                state.success = action.payload as boolean;

                localStorage.removeItem("currentUser");
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // GET ME
            .addCase(getMe.pending, (state) => { 
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(getMe.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.currentUser = action.payload;
                state.success = true;
                state.error = null;

                localStorage.setItem("currentUser", JSON.stringify(action.payload));
            })
            .addCase(getMe.rejected, (state, action) => {
                state.loading = false;
                state.currentUser = null;
                state.error = action.payload as string;
                state.success = false;
            });

},
});

export const { clearAuthStatus, setCurrentUser } = authSlice.actions;
export default authSlice.reducer;