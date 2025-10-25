import { useEffect, useState } from "react";
import { PostCard } from "@/components/PostCard";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role: string;
  avatar?: string | null;
  bio?: string;
  location?: string;
  website?: string;
  followersCount?: number;
  followingCount?: number;
  createdAt?: string;
}

interface Post {
  id: number;
  content: string;
  date: string;
  likes: number;
  comments: number;
  saved: number;
  avatar?: string;
  firstName: string;
  lastName: string;
  username: string;
}

const mockUser: User = {
  id: 1,
  firstName: "Alex",
  lastName: "Dev",
  userName: "@alex_dev",
  email: "alex@example.com",
  role: "premium",
  avatar: "https://placehold.co/100x100",
  bio: "Frontend developer, React enjoyer 🚀",
  location: "Moscow, Russia",
  website: "alexdev.io",
  followersCount: 120,
  followingCount: 85,
  createdAt: "2023-11-15",
};

const mockPosts: Post[] = [
  {
    id: 1,
    firstName: "Alex",
    lastName: "Dev",
    username: "alex_dev",
    content: "Работаю над новым pet-проектом 🚀",
    date: "2025-10-20",
    likes: 42,
    comments: 5,
    saved: 10,
  },
  {
    id: 2,
    firstName: "Alex",
    lastName: "Dev",
    username: "alex_dev",
    content: "Люблю тёмную тему ❤️",
    date: "2025-10-21",
    likes: 12,
    comments: 3,
    saved: 4,
  },
];

export const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // TODO: заменить на fetch(`/api/users/:id`)
    setUser(mockUser);
    setPosts(mockPosts);
  }, []);

  if (!user) return <div className="text-center py-10">Loading...</div>;

  return (
    <main className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-gray-800 dark:text-gray-100">
      {/* Шапка профиля */}
      <section className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-900 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={user.avatar || "https://placehold.co/100x100"}
            alt={user.userName}
            className="w-28 h-28 rounded-full object-cover border border-gray-300 dark:border-gray-600"
          />

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{user.userName}</p>

            <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>📍 {user.location || "—"}</span>
              {user.website && (
                <a
                  href={`https://${user.website}`}
                  target="_blank"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  🌐 {user.website}
                </a>
              )}
            </div>

            {user.bio && <p className="mt-4 text-gray-700 dark:text-gray-300">{user.bio}</p>}

            <div className="mt-5 flex justify-center sm:justify-start gap-6 text-sm">
              <span>
                <strong>{user.followersCount}</strong> Followers
              </span>
              <span>
                <strong>{user.followingCount}</strong> Following
              </span>
            </div>

            <button className="mt-6 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition">
              Edit Profile
            </button>
          </div>
        </div>
      </section>

      {/* Посты пользователя */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Posts</h3>
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              avatar={user.avatar || "https://placehold.co/70x70"}
              firstName={user.firstName}
              lastName={user.lastName}
              username={user.userName}
              content={post.content}
              date={post.date}
              likes={post.likes}
              comments={post.comments}
              saved={post.saved}
            />
          ))}
        </div>
      </section>
    </main>
  );
};
