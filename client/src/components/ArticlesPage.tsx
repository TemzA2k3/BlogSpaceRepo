import type { FC } from "react";
import { Input } from "@/shared/components/Input";
import { ArticleCard } from "./ArticleCard";

const ArticlesData = [
  {
    id: 1,
    name: "Tech Insights",
    description: "Tech Insights is a publication exploring the intersection of technology, culture, and society. We publish weekly essays, interviews, and analysis.",
    image: "https://placehold.co/320x171",
  },
  {
    id: 2,
    name: "The Future of Work",
    description: "The Future of Work is a publication focused on the changing nature of work, the impact of technology on the workforce, and strategies for adapting to the new realities.",
    image: "https://placehold.co/320x171",
  },
  {
    id: 3,
    name: "Design Thinking",
    description: "Design Thinking is a publication dedicated to exploring the principles and practices of design thinking, a human-centered approach to problem-solving and innovation.",
    image: "https://placehold.co/320x171",
  },
  {
    id: 4,
    name: "Sustainable Living",
    description: "Sustainable Living is a publication focused on promoting eco-friendly practices, sustainable lifestyles, and environmental awareness.",
    image: "https://placehold.co/320x171",
  },
  {
    id: 5,
    name: "Mindful Wellness",
    description: "Mindful Wellness is a publication dedicated to exploring mindfulness practices, mental well-being, and holistic approaches to health.",
    image: "https://placehold.co/320x171",
  },
  {
    id: 6,
    name: "Creative Writing",
    description: "Creative Writing is a publication for aspiring and established writers to share their stories, poems, and creative works.",
    image: "https://placehold.co/320x171",
  },
  {
    id: 7,
    name: "Travel Adventures",
    description: "Travel Adventures is a publication for travel enthusiasts to share their experiences, tips, and stories from around the world.",
    image: "https://placehold.co/320x171",
  },
  {
    id: 8,
    name: "Culinary Delights",
    description: "Culinary Delights is a publication for food lovers to share recipes, cooking tips, and culinary experiences.",
    image: "https://placehold.co/320x171",
  },
  {
    id: 9,
    name: "Financial Freedom",
    description: "Financial Freedom is a publication focused on personal finance, investing, and strategies for achieving financial independence.",
    image: "https://placehold.co/320x171",
  },
  {
    id: 10,
    name: "Space Exploration",
    description: "Space Exploration is a publication dedicated to sharing the latest news, discoveries, and insights about space exploration and astronomy.",
    image: "https://placehold.co/320x171",
  },
];


export const ArticlesPage: FC = () => {
  return (
    <div className="py-5 px-20 flex flex-col gap-4 items-center">
      <Input
        placeholder="Search"
        leftIcon={<i className="fas fa-search text-gray-400"></i>}
        rightIcon={<i className="fas fa-times text-gray-400"></i>}
      />
      <div className="w-full max-w-[1260px] inline-flex flex-col justify-start items-start overflow-hidden">
        {ArticlesData.map(data => 
          <ArticleCard 
            key={data.id}
            name={data.name}
            description={data.description}
            image={data.image}
          />
        )}
      </div>
    </div>
  );
};
