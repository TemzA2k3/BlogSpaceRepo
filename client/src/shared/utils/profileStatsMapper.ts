import type { ProfileStats, StatCardProps } from "../types/user.types";

const STAT_CONFIG: Record<
  keyof ProfileStats,
  Omit<StatCardProps, "value" | "change">
> = {
  postsThisMonth: {
    icon: "📝",
    title: "Постов за месяц",
    color: "bg-blue-100 dark:bg-blue-900/30",
  },
  newChats: {
    icon: "💬",
    title: "Новых чатов",
    color: "bg-green-100 dark:bg-green-900/30",
  },
  newFollowers: {
    icon: "👥",
    title: "Новых подписчиков",
    color: "bg-purple-100 dark:bg-purple-900/30",
  },
  newFollowing: {
    icon: "➕",
    title: "Новых подписок",
    color: "bg-pink-100 dark:bg-pink-900/30",
  },
  articlesPublished: {
    icon: "📰",
    title: "Статей опубликовано",
    color: "bg-orange-100 dark:bg-orange-900/30",
  },
  likesReceived: {
    icon: "❤️",
    title: "Лайков получено",
    color: "bg-red-100 dark:bg-red-900/30",
  },
  commentsReceived: {
    icon: "💭",
    title: "Комментариев",
    color: "bg-teal-100 dark:bg-teal-900/30",
  },
};

const formatValue = (value: number): number | string =>
  value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value;

type NullableStat = {
  value?: number | null;
  change?: number | null;
};

export const mapProfileStatsToCards = (
  stats: ProfileStats | null | undefined
): StatCardProps[] => {
  if (!stats) return [];

  return (Object.keys(STAT_CONFIG) as (keyof ProfileStats)[])
    .map((key) => {
      const stat = stats[key] as NullableStat | undefined;

      if (!stat) return null;

      const value = stat.value ?? 0;
      const change = stat.change ?? 0;

      return {
        ...STAT_CONFIG[key],
        value:
          key === "likesReceived"
            ? formatValue(value)
            : value,
        change,
      };
    })
    .filter(Boolean) as StatCardProps[];
};
