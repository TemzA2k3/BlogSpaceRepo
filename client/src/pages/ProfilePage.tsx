import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAppDispatch } from "@/hooks/reduxHooks";
import { setCurrentUser } from "@/store/slices/authSlice";

import { PostCard } from "@/components/PostCard";
import { useAlert } from "@/app/providers/alert/AlertProvider";
import { useAppSelector } from "@/hooks/reduxHooks";
import { fetchProfileUserData } from "@/shared/services/fetchUsersData";
import { changeUserAvatar } from "@/shared/services/changeUserAvatar";

import { getAvatarUrl } from "@/shared/utils/getImagesUrls";
import { followUser, unfollowUser } from "@/shared/services/userSubscriptions"

import { type ProfileUserData } from "@/shared/types/userTypes";
import { useTranslation } from "react-i18next";

// interface Post {
//     id: number;
//     content: string;
//     date: string;
//     likes: number;
//     comments: number;
//     saved: number;
//     avatar?: string;
//     firstName: string;
//     lastName: string;
//     currentUsername: string;
// }

// const mockPosts: Post[] = [
//     {
//         id: 1,
//         firstName: "Alex",
//         lastName: "Dev",
//         currentUsername: "alex_dev",
//         content: "Работаю над новым pet-проектом 🚀",
//         date: "2025-10-20",
//         likes: 42,
//         comments: 5,
//         saved: 10,
//     },
//     {
//         id: 2,
//         firstName: "Alex",
//         lastName: "Dev",
//         currentUsername: "alex_dev",
//         content: "Люблю тёмную тему ❤️",
//         date: "2025-10-21",
//         likes: 12,
//         comments: 3,
//         saved: 4,
//     },
// ];

export const ProfilePage = () => {
    const { t } = useTranslation();
    const { currentUser } = useAppSelector((state) => state.auth);
    const { id } = useParams<{ id: string }>();
    const { showAlert } = useAlert();
    const dispatch = useAppDispatch();

    const [userData, setUserData] = useState<ProfileUserData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isMyProfile, setIsMyProfile] = useState<boolean>(false);

    const [followLoading, setFollowLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!id || !currentUser) return;

        setLoading(true);
        setIsMyProfile(!!currentUser && +id === currentUser.id);

        fetchProfileUserData(id, currentUser?.id)
            .then(profileUserData => {
                setUserData(profileUserData)
            })
            .catch((e) => setError(e.message || t('error.fetchError')))
            .finally(() => setLoading(false));
    }, [id, currentUser]);

    useEffect(() => {
        if (!error) return;
        showAlert(error, "error");
    }, [error]);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const updatedUser = await changeUserAvatar(file);

            dispatch(setCurrentUser(updatedUser));
            showAlert(t('profile.updatedAvatar'), "success");
        } catch (err: any) {
            showAlert(err.message || t('profile.errorUpdatingAvatar'), "error");
        }
    };

    const handleFollow = async () => {
        if (!userData) return;
    
        setFollowLoading(true);
    
        try {
            if (userData.isFollowing) {
                await unfollowUser(userData.id);
                setUserData(prev => prev && ({
                    ...prev,
                    isFollowing: false,
                    followersCount: Math.max((prev.followersCount || 1) - 1, 0),
                }));
                showAlert(t('profile.unsubscribe'), "success");
            } else {
                await followUser(userData.id);
                setUserData(prev => prev && ({
                    ...prev,
                    isFollowing: true,
                    followersCount: (prev.followersCount || 0) + 1,
                }));
                showAlert(t('profile.subscribe'), "success");
            }
        } catch (err: any) {                        
            showAlert(err.message || t('profile.subError'), "error");
        } finally {
            setFollowLoading(false);
        }
    };
    

    if (!userData || loading)
        return <div className="text-center py-10">Loading...</div>;

    return (
        <main className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-gray-800 dark:text-gray-100">
            {/* Шапка профиля */}
            <section
                className={`border rounded-2xl p-6 shadow-sm mb-8 ${isMyProfile
                    ? "bg-white dark:bg-darkbg border-gray-200 dark:border-gray-700"
                    : "bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    }`}
            >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="relative w-28 h-28">
                        <img
                            src={getAvatarUrl(
                                userData.firstName,
                                userData.lastName,
                                userData.avatar
                            )}
                            alt={userData.userName}
                            className="w-28 h-28 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                        />
                        {isMyProfile && (
                            <label
                                className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer
                                bg-black text-white hover:bg-gray-700
                                dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500 transition-colors"
                            >
                                <i className="fa-solid fa-camera" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </label>
                        )}
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-2xl font-bold">
                            {userData.firstName} {userData.lastName}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            {userData.userName}
                        </p>

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

                        {userData.bio && (
                            <p className="mt-4 text-gray-700 dark:text-gray-300">
                                {userData.bio}
                            </p>
                        )}

                        <div className="mt-5 flex justify-center sm:justify-start gap-6 text-sm">
                            <span>
                                <strong>{userData.followersCount}</strong> Followers
                            </span>
                            <span>
                                <strong>{userData.followingCount}</strong> Following
                            </span>
                        </div>

                        {isMyProfile ? (
                            <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-3">
                                <button className="mt-6 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition">
                                    Edit Profile
                                </button>
                            </div>
                        ) : (
                            <div className="mt-6 flex gap-3 justify-center sm:justify-start">
                                <button
                                    onClick={handleFollow}
                                    disabled={followLoading}
                                    className={`px-5 py-2 rounded-xl font-medium transition flex items-center justify-center gap-2 ${userData.isFollowing
                                        ? "bg-red-600 hover:bg-red-700 text-white"
                                        : "bg-green-600 hover:bg-green-700 text-white"
                                        }`}
                                >
                                    {followLoading && <i className="fa fa-spinner fa-spin" />}
                                    {followLoading
                                        ? userData.isFollowing
                                            ? "Unfollowing..."
                                            : "Following..."
                                        : userData.isFollowing
                                            ? "Unfollow"
                                            : "Follow"}
                                </button>

                                <button className="px-5 py-2 rounded-xl bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium transition">
                                    Message
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Посты пользователя */}
            <section>
                <h3 className="text-xl font-semibold mb-4">Posts</h3>
                <div className="space-y-6">
                    {userData.posts.map((post) => (
                        <PostCard
                            key={post.id}
                            userId={userData.id}
                            avatar={getAvatarUrl(userData.firstName, userData.lastName,userData.avatar)}
                            firstName={userData.firstName}
                            lastName={userData.lastName}
                            username={userData.userName}
                            content={post.content}
                            image={post.image}
                            hashtags={post.hashtags}
                            date={post.createdAt}
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
