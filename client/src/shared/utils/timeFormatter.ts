import type { ChatMessage } from "@/shared/types/chat.types";
import type { ArticleSections } from "@/shared/types/article.types"

export const formatTime = (dateStr: string | Date | null) => {
    if (!dateStr) return ""
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

export const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
};

export const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: Record<string, ChatMessage[]> = {};

    messages.forEach(msg => {
        const date = new Date(msg.time);
        const key = date.toISOString().split("T")[0];

        if (!groups[key]) groups[key] = [];
        groups[key].push(msg);
    });

    return groups;
};

export const calculateReadTime = (sections: ArticleSections[]) => {
    if (!sections) return "unknown"
    return Math.ceil(sections.reduce((acc, s) => acc + s.content.length, 0) / 1000)
}


export const formatRelativeDate = (
    dateStr: string | Date,
    locale: "en" | "ru" = "ru"
  ): string => {
    if (!dateStr) return "";
  
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
  
    if (diffDay > 7) {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${day}.${month}.${year} ${hours}:${minutes}`;
    }

  
    if (diffDay >= 1) {
      return locale === "ru"
        ? `${diffDay} ${getRussianPlural(diffDay, "день", "дня", "дней")} назад`
        : `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
    }
    if (diffHour >= 1) {
      return locale === "ru"
        ? `${diffHour} ${getRussianPlural(diffHour, "час", "часа", "часов")} назад`
        : `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
    }
    if (diffMin >= 1) {
      return locale === "ru"
        ? `${diffMin} ${getRussianPlural(diffMin, "минута", "минуты", "минут")} назад`
        : `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
    }
    return locale === "ru"
      ? `${diffSec} ${getRussianPlural(diffSec, "секунда", "секунды", "секунд")} назад`
      : `${diffSec} second${diffSec > 1 ? "s" : ""} ago`;
  };
  
  const getRussianPlural = (n: number, one: string, few: string, many: string) => {
    const mod10 = n % 10;
    const mod100 = n % 100;
  
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
    return many;
  };
  