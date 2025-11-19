import type { FC } from "react";
import { Outlet } from "react-router-dom";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const MainLayout: FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-40 py-5">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
