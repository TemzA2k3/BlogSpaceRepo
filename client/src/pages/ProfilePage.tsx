import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { PostCard } from "@/components/PostCard";
import { useAlert } from "@/app/providers/alert/AlertProvider";
import { useAppSelector } from "@/hooks/reduxHooks";
import { fetchAnotherUserData } from "@/shared/services/fetchUsersData"

import { type User } from "@/shared/types/userTypes";

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
  currentUsername: string;
}

const mockPosts: Post[] = [
  {
    id: 1,
    firstName: "Alex",
    lastName: "Dev",
    currentUsername: "alex_dev",
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
    currentUsername: "alex_dev",
    content: "Люблю тёмную тему ❤️",
    date: "2025-10-21",
    likes: 12,
    comments: 3,
    saved: 4,
  },
];

export const ProfilePage = () => {
    const { currentUser } = useAppSelector(state => state.auth)
    const { id } = useParams<{ id: string }>();
    const { showAlert } = useAlert();

    const [userData, setUserData] = useState<User | null>(null)
    const [posts, setPosts] = useState<Post[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    

    //TODO тут баг, если юзера нет в кеще, то будет вызываться else при перезагрузке странички
    useEffect(() => {
        if (!id) return;
        console.log('prev');
      
        if (currentUser && +id === currentUser.id) {
          console.log('currentuser');
          setPosts(mockPosts);
          setUserData(currentUser);
        } else {
          console.log('NENENEN currentuser');
          setLoading(true)
          fetchAnotherUserData(id)
            .then(data => setUserData(data))
            .catch(() => setError('Failed to fetch'))
            .finally(() => setLoading(false))
        }
      }, [id, currentUser]);

      useEffect(() => {
        if (!error) return;

        showAlert(error, "error");
      }, [error])

  if (!userData || loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <main className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-gray-800 dark:text-gray-100">
      {/* Шапка профиля */}
      <section className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-900 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={userData.avatar || "https://placehold.co/100x100"}
            alt={userData.userName}
            className="w-28 h-28 rounded-full object-cover border border-gray-300 dark:border-gray-600"
          />

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold">
              {userData.firstName} {userData.lastName}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{userData.userName}</p>

            <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>📍 {userData.location || "—"}</span>
              {userData.website && (
                <a
                  href={`https://${userData.website}`}
                  target="_blank"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  🌐 {userData.website}
                </a>
              )}
            </div>

            {userData.bio && <p className="mt-4 text-gray-700 dark:text-gray-300">{userData.bio}</p>}

            <div className="mt-5 flex justify-center sm:justify-start gap-6 text-sm">
              <span>
                <strong>{userData.followersCount}</strong> Followers
              </span>
              <span>
                <strong>{userData.followingCount}</strong> Following
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
              avatar={userData.avatar || "https://placehold.co/70x70"}
              firstName={userData.firstName}
              lastName={userData.lastName}
              username={userData.userName}
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
