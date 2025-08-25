import { Link, Outlet } from 'react-router-dom'

export const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="max-w-4xl mx-auto px-4 py-4 flex gap-4">
          <Link className="text-blue-600 hover:underline" to="/">Главная</Link>
          <Link className="text-blue-600 hover:underline" to="/about">О проекте</Link>
        </nav>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}