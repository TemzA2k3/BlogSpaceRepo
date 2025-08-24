export const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Tailwind CSS работает!
        </h1>
        <p className="text-gray-600">
          Если вы видите этот текст с красивым стилем, значит Tailwind CSS успешно установлен.
        </p>
        <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Кнопка
        </button>
      </div>
    </div>
  )
}