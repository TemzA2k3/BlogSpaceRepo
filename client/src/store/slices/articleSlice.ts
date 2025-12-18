import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

import type { ArticlePreview, ArticlesState } from "@/shared/types/article.types";

import { apiRequest } from "@/shared/api/apiClient";


const initialState: ArticlesState = {
    articles: [],
    isLoading: false,
    error: null,
    offset: 0,
    limit: 21,
    hasMore: true,
};


export const fetchArticles = createAsyncThunk<
    ArticlePreview[],
    void,
    { state: { articles: ArticlesState } }
>(
    "articles/fetchAll",
    async (_, { getState, rejectWithValue }) => {
        try {
            const { offset, limit } = getState().articles;

            const data = await apiRequest<ArticlePreview[]>(
                `/articles?limit=${limit}&offset=${offset}`,
                "GET",
            );

            return data || [];
        } catch (err: any) {
            return rejectWithValue(err.message || "Ошибка при загрузке статей");
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
            state.offset = 0;
            state.hasMore = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchArticles.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchArticles.fulfilled, (state, action: PayloadAction<ArticlePreview[]>) => {
                state.isLoading = false;

                if (action.payload.length < state.limit) {
                    state.hasMore = false;
                }

                state.articles.push(...action.payload);
                state.offset += state.limit;
            })
            .addCase(fetchArticles.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            .addCase(createArticle.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(createArticle.fulfilled, (state, action: PayloadAction<ArticlePreview>) => {
                state.isLoading = false
                state.articles.unshift(action.payload)
                state.offset += 1;
            })
            .addCase(createArticle.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    },
});

export const { clearArticles } = articlesSlice.actions;
export default articlesSlice.reducer;
