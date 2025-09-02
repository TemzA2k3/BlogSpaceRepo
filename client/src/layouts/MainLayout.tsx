import type { FC } from "react";
import { Outlet } from "react-router-dom";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";


export const MainLayout: FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 px-40 py-5">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
