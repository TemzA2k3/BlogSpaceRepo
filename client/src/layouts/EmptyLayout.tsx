import type { FC } from "react";
import { Outlet } from "react-router-dom";

export const EmptyLayout: FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-darkbg text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <Outlet />
    </div>
  );
};
