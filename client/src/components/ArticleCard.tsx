import { type FC } from "react";

interface IArticleCard {
  name: string;
  description: string;
  image: string;
}

export const ArticleCard: FC<IArticleCard> = ({ name, description, image }) => {
  return (
    <div className="self-stretch p-6 flex flex-col justify-start items-start">
      <div className="self-stretch rounded-2xl flex justify-between items-start gap-6">
        <div className="flex flex-col justify-start items-start gap-3 w-2/3">
          <div className="w-full">
            <h2 className="text-neutral-900 text-2xl font-bold leading-snug">
              {name}
            </h2>
          </div>
          <div className="w-full">
            <p className="text-slate-600 text-lg font-normal leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        <img
          className="w-80 h-56 object-cover rounded-2xl"
          src={image}
          alt={name}
        />
      </div>
    </div>
  );
};
