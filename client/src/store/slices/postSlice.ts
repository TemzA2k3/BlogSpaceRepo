import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

import { apiRequest } from "@/shared/api/apiClient";

import type { Post, UsersPosts, PostsState } from "@/shared/types/post.types";


const initialState: PostsState = {
    posts: [],
    loading: false,
    error: null,
    success: false,
};

// Thunks
export const getPosts = createAsyncThunk(
    "posts/getPosts",
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiRequest<Post[]>("/posts", "GET");
            return data as UsersPosts[] || [];
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to fetch posts");
        }
    }
);

export const createPost = createAsyncThunk<UsersPosts, FormData>(
    "posts/createPost",
    async (formData, { rejectWithValue }) => {

        try {
            const data = await apiRequest<Post>("/posts", "POST", {
                body: formData,
                credentials: "include",
            });

            console.log(data);


            return data as UsersPosts;
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to create post");
        }
    }
);

export const likePost = createAsyncThunk<UsersPosts | null, number>(
    "posts/likePost",
    async (postId, { rejectWithValue }) => {
        try {
            const data = await apiRequest<UsersPosts>(`/posts/${postId}/like`, "PATCH");
            return data ?? null;
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to like post");
        }
    }
);

export const toggleSavePost = createAsyncThunk<UsersPosts | null, number>(
    "posts/toggleSavePost",
    async (postId, { rejectWithValue }) => {
        try {
            const data = await apiRequest<UsersPosts>(`/posts/${postId}/save`, "PATCH");
            return data ?? null;
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to toggle save post");
        }
    }
);


export const deletePost = createAsyncThunk<number, number>(
    "posts/deletePost",
    async (postId, { rejectWithValue }) => {
        try {
            await apiRequest(`/posts/${postId}`, "DELETE");
            return postId;
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to delete post");
        }
    }
);


// Slice
const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        clearPostsStatus(state) {
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // GET POSTS
            .addCase(getPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPosts.fulfilled, (state, action: PayloadAction<UsersPosts[]>) => {
                state.loading = false;
                state.posts = action.payload;
                state.success = true;
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // CREATE POST
            .addCase(createPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action: PayloadAction<UsersPosts>) => {
                state.loading = false;
                state.posts.unshift(action.payload);
                state.success = true;
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // DELETE POST
            .addCase(deletePost.pending, (state) => {
                state.error = null;
            })
            .addCase(deletePost.fulfilled, (state, action: PayloadAction<number>) => {
                state.posts = state.posts.filter((post) => post.id !== action.payload);
                state.success = true;
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            // LIKE POST
            .addCase(likePost.pending, (state) => {
                state.error = null;
            })
            .addCase(likePost.fulfilled, (state, action: PayloadAction<UsersPosts | null>) => {
                if (!action.payload) return;

                const index = state.posts.findIndex(p => p.id === action.payload!.id);
                if (index !== -1) {
                    state.posts[index] = action.payload!;
                }
            })
            .addCase(likePost.rejected, (state, action) => {
                state.error = (action.payload as string) ?? "Ошибка при лайке поста";
            })


            // SAVE POST
            .addCase(toggleSavePost.pending, (state) => {
                state.error = null;
            })
            .addCase(toggleSavePost.fulfilled, (state, action: PayloadAction<UsersPosts | null>) => {
                if (!action.payload) return;
            
                const index = state.posts.findIndex(p => p.id === action.payload!.id);
                if (index !== -1) {
                    state.posts[index] = action.payload!;
                }
            })
            .addCase(toggleSavePost.rejected, (state, action) => {
                state.error = (action.payload as string) ?? "Ошибка при сохранении поста";
            });

    },
});

export const { clearPostsStatus } = postSlice.actions;
export default postSlice.reducer;
