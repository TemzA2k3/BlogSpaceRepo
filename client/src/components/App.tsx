import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header/>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};
