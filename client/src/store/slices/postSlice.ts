import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

import { apiRequest } from "@/shared/api/apiClient";

import type { Post, PostsState, CreatePostData } from "@/shared/types/postTypes";


const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
  success: false,
};

// Thunks
export const getPosts = createAsyncThunk<Post[]>(
  "posts/getPosts",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest<Post[]>("/posts", "GET");
      return data || [];
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch posts");
    }
  }
);

export const createPost = createAsyncThunk<Post, FormData>(
  "posts/createPost",
  async (formData, { rejectWithValue }) => {
    
    try {
      const data = await apiRequest<Post>("/posts", "POST", { 
            body: formData,
            credentials: "include",
        });

        console.log(data);
        

      return data as Post;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to create post");
    }
  }
);

// export const likePost = createAsyncThunk<Post, number>(
//   "posts/likePost",
//   async (postId, { rejectWithValue }) => {
//     try {
//       const data = await apiRequest<Post>(`/posts/${postId}/like`, "POST");
//       return data as Post;
//     } catch (err: any) {
//       return rejectWithValue(err.message || "Failed to like post");
//     }
//   }
// );

// export const savePost = createAsyncThunk<Post, number>(
//   "posts/savePost",
//   async (postId, { rejectWithValue }) => {
//     try {
//       const data = await apiRequest<Post>(`/posts/${postId}/save`, "POST");
//       return data as Post;
//     } catch (err: any) {
//       return rejectWithValue(err.message || "Failed to save post");
//     }
//   }
// );

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
      .addCase(getPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
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
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading = false;
        state.posts.unshift(action.payload); // добавляем новый пост в начало
        state.success = true;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // LIKE POST
    //   .addCase(likePost.fulfilled, (state, action: PayloadAction<Post>) => {
    //     const index = state.posts.findIndex(p => p.id === action.payload.id);
    //     if (index !== -1) {
    //       state.posts[index] = action.payload;
    //     }
    //   })

      // SAVE POST
    //   .addCase(savePost.fulfilled, (state, action: PayloadAction<Post>) => {
    //     const index = state.posts.findIndex(p => p.id === action.payload.id);
    //     if (index !== -1) {
    //       state.posts[index] = action.payload;
    //     }
    //   });
  },
});

export const { clearPostsStatus } = postSlice.actions;
export default postSlice.reducer;
