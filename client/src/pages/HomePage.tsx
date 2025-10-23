import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const HomePage = () => {
  const { t } = useTranslation();

  return (
    <main className="max-w-5xl mx-auto py-10 px-6 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">
        {t("home.welcome") || "Добро пожаловать в Communly"}
      </h1>

      <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
        Это место, где можно делиться мыслями, писать статьи, комментировать посты и находить единомышленников.
      </p>

      <div className="flex gap-4">
        <Link to="/posts" className="text-blue-600 dark:text-blue-400 hover:underline">
          Перейти к постам →
        </Link>
        <Link to="/articles" className="text-blue-600 dark:text-blue-400 hover:underline">
          Читать статьи →
        </Link>
      </div>
    </main>
  );
};
