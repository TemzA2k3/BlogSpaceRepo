import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/layouts/Header";

export const HeaderLayout: FC = () => {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <main className="flex-1 w-full flex overflow-hidden">
          <Outlet />
        </main>
      </div>
    );
  };
  
