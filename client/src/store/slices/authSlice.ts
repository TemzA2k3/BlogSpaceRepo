import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

import { apiRequest } from "@/shared/api/apiClient";

import type {
    User,
    RegisterUserData,
    LoginUserData,
    AuthState,
    UpdateSettingsPayload,
} from "@/shared/types/user.types";

const initialState: AuthState = {
    currentUser: null,
    loading: false,
    success: false,
    error: null,
    initialized: false,
    settingsLoading: false,
    settingsUpdating: false,
    settingsError: null,
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
            }) as User;

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
            }) as User;

            return data;
        } catch (err: any) {
            return rejectWithValue(err.message || "Something went wrong...");
        }
    }
);

// Settings thunks
export const fetchSettings = createAsyncThunk(
    "auth/fetchSettings",
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState() as { auth: AuthState };
            const userId = auth.currentUser?.id;

            if (!userId) {
                return rejectWithValue("User not authenticated");
            }

            const data = await apiRequest<User>(`/users/${userId}/settings`, "GET", {
                credentials: "include",
            }) as User;

            return data;
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to fetch settings");
        }
    }
);

export const updateSettings = createAsyncThunk(
    "auth/updateSettings",
    async (payload: UpdateSettingsPayload, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState() as { auth: AuthState };
            const userId = auth.currentUser?.id;

            if (!userId) {
                return rejectWithValue("User not authenticated");
            }

            const data = await apiRequest<User>(`/users/${userId}/settings`, "PATCH", {
                body: payload,
                credentials: "include",
            }) as User;

            return data;
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to update settings");
        }
    }
);

export const deleteAccount = createAsyncThunk(
    "auth/deleteAccount",
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState() as { auth: AuthState };
            const userId = auth.currentUser?.id;

            if (!userId) {
                return rejectWithValue("User not authenticated");
            }

            await apiRequest(`/users/${userId}`, "DELETE", {
                credentials: "include",
            });

            return true;
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to delete account");
        }
    }
);

export const changePassword = createAsyncThunk(
    "auth/changePassword",
    async (
        { currentPassword, newPassword }: { currentPassword: string; newPassword: string },
        { getState, rejectWithValue }
    ) => {
        try {
            const { auth } = getState() as { auth: AuthState };
            const userId = auth.currentUser?.id;

            if (!userId) {
                return rejectWithValue("User not authenticated");
            }

            await apiRequest(`/users/${userId}/password`, "PATCH", {
                body: { currentPassword, newPassword },
                credentials: "include",
            });

            return true;
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to change password");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<User>) => {
            state.currentUser = action.payload;
        },
        clearAuthStatus(state) {
            state.error = null;
            state.success = false;
        },
        clearSettingsError(state) {
            state.settingsError = null;
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
                state.initialized = true;
            })
            .addCase(getMe.rejected, (state, action) => {
                state.loading = false;
                state.currentUser = null;
                state.error = action.payload as string;
                state.success = false;
                state.initialized = true;
            })

            // FETCH SETTINGS
            .addCase(fetchSettings.pending, (state) => {
                state.settingsLoading = true;
                state.settingsError = null;
            })
            .addCase(fetchSettings.fulfilled, (state, action: PayloadAction<User>) => {
                state.settingsLoading = false;
                state.currentUser = action.payload;
            })
            .addCase(fetchSettings.rejected, (state, action) => {
                state.settingsLoading = false;
                state.settingsError = action.payload as string;
            })

            // UPDATE SETTINGS
            .addCase(updateSettings.pending, (state) => {
                state.settingsUpdating = true;
                state.settingsError = null;
            })
            .addCase(updateSettings.fulfilled, (state, action: PayloadAction<User>) => {
                state.settingsUpdating = false;
                state.currentUser = action.payload;
            })
            .addCase(updateSettings.rejected, (state, action) => {
                state.settingsUpdating = false;
                state.settingsError = action.payload as string;
            })

            // DELETE ACCOUNT
            .addCase(deleteAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAccount.fulfilled, (state) => {
                state.loading = false;
                state.currentUser = null;
                state.initialized = false;
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // CHANGE PASSWORD
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearAuthStatus, setCurrentUser, clearSettingsError } = authSlice.actions;
export default authSlice.reducer;
