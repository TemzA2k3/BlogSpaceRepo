export interface TrendingTopic {
    tag: string;
    count: number;
}

export interface TrendingTopicsCardProps {
    topics: TrendingTopic[];
}