import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

import type { ArticlePreview, ArticlesState } from "@/shared/types/articleTypes";

// TODO временные mock-данные — можно заменить API-запросом
import { mockArticles } from "@/shared/mocks/articles";


const initialState: ArticlesState = {
    articles: [],
    isLoading: false,
    error: null,
};


export const fetchArticles = createAsyncThunk<ArticlePreview[]>(
    "articles/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            // Здесь можно заменить на реальный API-запрос:
            // const response = await fetch("/api/articles");
            // if (!response.ok) throw new Error("Failed to fetch");
            // return await response.json();

            // имитация задержки для реализма
            await new Promise((resolve) => setTimeout(resolve, 500));
            return mockArticles;
        } catch (err) {
            return rejectWithValue("Ошибка при загрузке статей");
        }
    }
);


/**
 * ✅ Создание новой статьи
 * принимает FormData (title, content, tags[], coverImage)
 */
export const createArticle = createAsyncThunk<
  ArticlePreview,
  FormData,
  { rejectValue: string }
>("articles/create", async (formData, { rejectWithValue }) => {
  try {
    // 🚀 Пример API-запроса (замени URL на свой)
    // const response = await fetch("/api/articles", {
    //   method: "POST",
    //   body: formData,
    // })
    // if (!response.ok) throw new Error("Ошибка при создании статьи")
    // const data = await response.json()
    // return data as ArticlePreview

    // 🧪 Временная имитация
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Преобразуем FormData в объект
    const newArticle: ArticlePreview = {
      id: Math.floor(Math.random() * 10000),
      title: formData.get("title") as string,
      author: "current_user", // позже заменится на currentUser.userName
      authorId: 999, // позже заменится на currentUser.id
      content: (formData.get("content") as string) || "",
      imageUrl: formData.get("coverImage")
        ? URL.createObjectURL(formData.get("coverImage") as File)
        : "https://picsum.photos/seed/new/400/250",
      tags: JSON.parse((formData.get("tags") as string) || "[]").map(
        (t: string, i: number) => ({ id: i + 1, name: t.startsWith("#") ? t : `#${t}` })
      ),
    }

    return newArticle
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
