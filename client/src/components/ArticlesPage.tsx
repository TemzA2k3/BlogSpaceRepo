interface Article {
    id: number;
    title: string;
    author: string;
    excerpt: string;
    tags: string[];
  }
  
  const mockArticles: Article[] = [
    {
      id: 1,
      title: "10 советов по работе с React",
      author: "frontend_guru",
      excerpt: "React — мощный инструмент, но часто допускаются ошибки. Вот как их избежать...",
      tags: ["#react", "#frontend", "#tips"],
    },
    {
      id: 2,
      title: "Почему TypeScript спасает ваши проекты",
      author: "jslover",
      excerpt: "TypeScript помогает писать более надежный код. В этой статье расскажу почему.",
      tags: ["#typescript", "#javascript", "#bestpractices"],
    },
    {
      id: 3,
      title: "Как писать чистый код в 2025 году",
      author: "tech_writer",
      excerpt: "Чистый код — не просто про форматирование. Это про мышление и подход.",
      tags: ["#cleanCode", "#software", "#architecture"],
    },
  ];
  
  export const ArticlesPage = () => {
    return (
      <main className="max-w-5xl mx-auto py-10 px-6 text-gray-800 dark:text-gray-100">
        <h2 className="text-2xl font-semibold mb-6">Статьи</h2>
  
        <div className="space-y-6">
          {mockArticles.map(article => (
            <article
              key={article.id}
              className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-900 transition-colors"
            >
              <h3 className="text-xl font-bold mb-2">{article.title}</h3>
              <p className="text-gray-500 text-sm mb-3">Автор: @{article.author}</p>
              <p className="mb-4">{article.excerpt}</p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <span key={tag} className="text-blue-600 dark:text-blue-400 text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </main>
    );
  };
  