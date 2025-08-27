import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      {/* main должен занимать всё доступное место */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
