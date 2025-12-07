import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

import type { ArticlePreview, ArticlesState } from "@/shared/types/article.types";

import { apiRequest } from "@/shared/api/apiClient";


const initialState: ArticlesState = {
    articles: [],
    isLoading: false,
    error: null,
};


export const fetchArticles = createAsyncThunk<ArticlePreview[]>(
    "articles/fetchAll",
    async (_, { rejectWithValue }) => {
        try {

            const data = await apiRequest<ArticlePreview[]>("/articles", "GET", {
                credentials: "include",
            })

            return data || [];
        } catch (err) {
            return rejectWithValue("Ошибка при загрузке статей");
        }
    }
);

export const createArticle = createAsyncThunk<
    ArticlePreview,
    FormData,
    { rejectValue: string }
>("articles/create", async (formData, { rejectWithValue }) => {
    try {
        // for (const [key, value] of formData.entries()) {
        //     console.log(key, value);
        // }

        const data = await apiRequest<ArticlePreview>("/articles", "POST", {
            credentials: "include",
            body: formData
        })


        return data as ArticlePreview
    } catch (err: any) {
        return rejectWithValue(err.message || "Ошибка при создании статьи")
    }
})



const articlesSlice = createSlice({
    name: "articles",
    initialState,
    reducers: {
        clearArticles(state) {
            state.articles = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchArticles.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                fetchArticles.fulfilled,
                (state, action: PayloadAction<ArticlePreview[]>) => {
                    state.isLoading = false;
                    state.articles = action.payload;
                }
            )
            .addCase(fetchArticles.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // --- ✅ Обработка создания статьи ---
            .addCase(createArticle.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(createArticle.fulfilled, (state, action: PayloadAction<ArticlePreview>) => {
                state.isLoading = false
                state.articles.unshift(action.payload)
            })
            .addCase(createArticle.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    },
});

export const { clearArticles } = articlesSlice.actions;
export default articlesSlice.reducer;
