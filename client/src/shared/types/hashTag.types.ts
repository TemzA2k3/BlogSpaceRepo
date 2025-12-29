export type HashTag = {
    id: number,
    name: string
}

export interface HashTagProps {
    tag: string;
    onRemove: () => void;
}

export interface HashTagsDisplayProps {
    tags: HashTag[];
}