import { useState } from "react";

import { UserCard } from "@/components/UserCard";

import { type User } from "@/shared/types/userTypes";

export const mockUsers: User[] = [
    {
      id: 1,
      firstName: "Артем",
      lastName: "Иванов",
      userName: "frontend_guru",
      email: "artem.ivanov@example.com",
      role: "user",
      avatar: "https://i.pravatar.cc/150?u=frontend_guru",
      isBlocked: false,
      bio: "Люблю фронтенд и React",
      location: "Москва, Россия",
      website: "https://frontendguru.ru",
      createdAt: "2023-01-15",
      followersCount: 1200,
      followingCount: 300,
    },
    {
      id: 2,
      firstName: "Мария",
      lastName: "Петрова",
      userName: "jslover",
      email: "maria.petrova@example.com",
      role: "user",
      avatar: "https://i.pravatar.cc/150?u=jslover",
      isBlocked: false,
      bio: "TypeScript фанат",
      location: "Санкт-Петербург, Россия",
      website: "https://jslover.dev",
      createdAt: "2022-11-03",
      followersCount: 950,
      followingCount: 400,
    },
    {
      id: 3,
      firstName: "Иван",
      lastName: "Смирнов",
      userName: "tech_writer",
      email: "ivan.smirnov@example.com",
      role: "user",
      avatar: "https://i.pravatar.cc/150?u=tech_writer",
      isBlocked: false,
      bio: "Пишу о чистом коде и архитектуре",
      location: "Казань, Россия",
      website: "https://techwriter.blog",
      createdAt: "2021-08-21",
      followersCount: 800,
      followingCount: 250,
    },
  ];
  


  
  export const ExplorePage = () => {
    const [searchTerm, setSearchTerm] = useState("");
  
    const filteredUsers = mockUsers.filter((user) => {
      const term = searchTerm.toLowerCase();
      return (
        user.userName.toLowerCase().includes(term) ||
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term)
      );
    });
  
    return (
      <main className="max-w-3xl mx-auto py-10 px-4 text-gray-800 dark:text-gray-100">
        
        {/* Заголовок Search */}
        <h2 className="text-xl font-semibold mb-4">Search</h2>
  
        {/* Инпут */}
        <input
          type="text"
          placeholder="Поиск пользователей..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-darkbg px-4 py-3 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 transition-all"
        />
  
        {/* Список пользователей */}
        <div className="flex flex-col gap-2">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
                firstName={user.firstName}
                lastName={user.lastName}
                userName={user.userName}
                avatar={user.avatar}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              Пользователи не найдены.
            </p>
          )}
        </div>
      </main>
    );
  };
  