import { useState } from "react";

import { ArticleCard } from "@/components/ArticleCard";

import { type Article } from "@/shared/types/articleTypes"


const mockArticles: Article[] = [
    {
      id: 1,
      authorId: 101,
      title: "10 советов по работе с React",
      author: "frontend_guru",
      content:
        "React — мощный инструмент, но часто допускаются ошибки. Вот как их избежать...",
      tags: ["#react", "#frontend", "#tips"],
      imageUrl: "https://picsum.photos/seed/1/400/250",
    },
    {
      id: 2,
      authorId: 102,
      title: "Почему TypeScript спасает ваши проекты",
      author: "jslover",
      content:
        "TypeScript помогает писать более надёжный код. В этой статье расскажу почему.",
      tags: ["#typescript", "#javascript", "#bestpractices"],
      imageUrl: "https://picsum.photos/seed/2/400/250",
    },
    {
      id: 3,
      authorId: 103,
      title: "Как писать чистый код в 2025 году",
      author: "tech_writer",
      content:
        "Чистый код — не просто про форматирование. Это про мышление и подход.",
      tags: ["#cleanCode", "#software", "#architecture"],
      imageUrl: "https://picsum.photos/seed/3/400/250",
    },
    {
      id: 4,
      authorId: 104,
      title: "Зачем нужен Zustand и как он упрощает state management",
      author: "state_master",
      content:
        "Многие ищут замену Redux. Zustand предлагает лёгкий и интуитивный подход без бойлерплейта.",
      tags: ["#zustand", "#react", "#state"],
      imageUrl: "https://picsum.photos/seed/4/400/250",
    },
    {
      id: 5,
      authorId: 105,
      title: "Оптимизация Lighthouse: как получить 100/100",
      author: "seo_ninja",
      content:
        "Советы по улучшению производительности, доступности и SEO вашего сайта.",
      tags: ["#performance", "#lighthouse", "#seo"],
      imageUrl: "https://picsum.photos/seed/5/400/250",
    },
    {
      id: 6,
      authorId: 106,
      title: "Tailwind CSS: дизайн без страданий",
      author: "ui_crafter",
      content:
        "Tailwind стал стандартом де-факто для быстрой стилизации. Разберём лучшие практики и подводные камни.",
      tags: ["#tailwind", "#css", "#frontend"],
      imageUrl: "https://picsum.photos/seed/6/400/250",
    },
    {
      id: 7,
      authorId: 107,
      title: "Node.js 22: что нового и зачем обновляться",
      author: "backend_boss",
      content:
        "Последняя версия Node.js приносит улучшения в производительности, безопасности и работе с потоками.",
      tags: ["#nodejs", "#backend", "#update"],
      imageUrl: "https://picsum.photos/seed/7/400/250",
    },
    {
      id: 8,
      authorId: 108,
      title: "Next.js App Router: практическое руководство",
      author: "fullstack_hero",
      content:
        "Переход на App Router может пугать, но с ним проект становится чище и быстрее. Вот как начать.",
      tags: ["#nextjs", "#react", "#routing"],
      imageUrl: "https://picsum.photos/seed/8/400/250",
    },
    {
      id: 9,
      authorId: 109,
      title: "AI в веб-разработке: что стоит автоматизировать уже сейчас",
      author: "ml_coder",
      content:
        "От генерации тестов до рефакторинга кода — ИИ-инструменты уже реально экономят часы работы.",
      tags: ["#ai", "#automation", "#tools"],
      imageUrl: "https://picsum.photos/seed/9/400/250",
    },
    {
      id: 10,
      authorId: 110,
      title: "Почему UX важнее, чем вы думаете",
      author: "design_sensei",
      content:
        "UX — не просто кнопки и формы. Это про то, как пользователь чувствует себя в вашем продукте.",
      tags: ["#ux", "#design", "#usability"],
      imageUrl: "https://picsum.photos/seed/10/400/250",
    },
    {
      id: 11,
      authorId: 111,
      title: "React Query vs TanStack Query: в чём разница?",
      author: "data_fetcher",
      content:
        "Новый бренд, но та же мощь. Разбираемся, что изменилось и стоит ли мигрировать.",
      tags: ["#reactquery", "#tanstack", "#data"],
      imageUrl: "https://picsum.photos/seed/11/400/250",
    },
    {
      id: 12,
      authorId: 112,
      title: "Docker для новичков: быстрый старт",
      author: "devops_kid",
      content:
        "Контейнеризация — не страшно. Разберём основные команды Docker и создадим первый контейнер.",
      tags: ["#docker", "#devops", "#tutorial"],
      imageUrl: "https://picsum.photos/seed/12/400/250",
    },
    {
      id: 13,
      authorId: 113,
      title: "GraphQL: когда стоит использовать, а когда — нет",
      author: "api_architect",
      content:
        "GraphQL решает множество проблем REST, но добавляет свои. Взвешиваем плюсы и минусы.",
      tags: ["#graphql", "#api", "#architecture"],
      imageUrl: "https://picsum.photos/seed/13/400/250",
    },
    {
      id: 14,
      authorId: 114,
      title: "Секреты производительного Redux Toolkit",
      author: "state_wizard",
      content:
        "Redux Toolkit делает работу с состоянием проще и безопаснее. Разберём скрытые возможности.",
      tags: ["#redux", "#toolkit", "#state"],
      imageUrl: "https://picsum.photos/seed/14/400/250",
    },
    {
      id: 15,
      authorId: 115,
      title: "Лучшие VS Code плагины для фронтенда",
      author: "code_addict",
      content:
        "Эти расширения экономят часы работы и делают кодинг приятнее. Проверь, какие у тебя уже стоят!",
      tags: ["#vscode", "#productivity", "#frontend"],
      imageUrl: "https://picsum.photos/seed/15/400/250",
    },
  ];
  
  

export const ArticlesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = mockArticles.filter((article) => {
    const term = searchTerm.toLowerCase();
    return (
      article.title.toLowerCase().includes(term) ||
      article.author.toLowerCase().includes(term) ||
      article.tags.some((tag) => tag.toLowerCase().includes(term))
    );
  });

  return (
    <main className="max-w-6xl mx-auto py-10 px-6 text-gray-800 dark:text-gray-100">
      {/* Поисковая строка */}
      <div className="mb-8 flex justify-start">
        <input
          type="text"
          placeholder="Поиск статей..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-darkbg px-4 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Сетка статей */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <ArticleCard
                key={article.id}
                id={article.id}
                title={article.title}
                author={article.author}
                authorId={article.authorId}
                content={article.content}
                tags={article.tags}
                imageUrl="https://placehold.co/100x100"
            />
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
            Ничего не найдено.
          </p>
        )}
      </div>
    </main>
  );
};
