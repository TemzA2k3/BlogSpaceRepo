import type { FC } from "react";
import { Outlet } from "react-router-dom";

export const EmptyLayout: FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Outlet />
    </div>
  );
};
