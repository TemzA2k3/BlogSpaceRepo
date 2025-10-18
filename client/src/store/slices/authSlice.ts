import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

import { apiRequest } from "@/shared/api/apiClient";

interface SendUserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface User {
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
    checked: boolean;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    success: false,
    error: null,
    checked: false,
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
        { firstName, lastName, email, password }: SendUserData,
        { rejectWithValue }
    ) => {
        try {
            const data = await apiRequest<User>("/auth/register", "POST", {
                body: { firstName, lastName, email, password },
                credentials: "include",
            });

            console.log(data);
            

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
                state.user = action.payload;
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
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.user = null;
                state.success = action.payload as boolean;
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
                state.user = action.payload;
                state.success = true;
                state.error = null;
            })
            .addCase(getMe.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.error = action.payload as string;
                state.success = false;
            });

},
});

export const { clearAuthStatus } = authSlice.actions;
export default authSlice.reducer;
