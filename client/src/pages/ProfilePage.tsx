import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAlert } from "@/app/providers/alert/AlertProvider";
import { useAppSelector } from "@/hooks/redux/reduxHooks";

import { useProfile } from "@/hooks/profile/useProfile";
import { useAvatarUpdater } from "@/hooks/profile/useAvatarUpdater";
import { useFollow } from "@/hooks/profile/useFollow";
import { useCreateChat } from "@/hooks/profile/useCreateChat";

import { StatCard } from "@/components/StatCard";
import { Loader } from "@/shared/components/Loader";

import { getAvatarUrl } from "@/shared/utils/getImagesUrls";
import { mapProfileStatsToCards } from "@/shared/utils/profileStatsMapper";

export const ProfilePage = () => {
    const { t } = useTranslation();
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const { currentUser } = useAppSelector((state) => state.auth);
    const { id } = useParams<{ id: string }>();

    const { userData, loading, error, isMyProfile, setUserData } = useProfile(id, currentUser?.id);
    const { handleAvatarChange } = useAvatarUpdater((prev) => prev && setUserData(prev));
    const { handleFollow, loading: followLoading } = useFollow(userData, setUserData, currentUser?.id);
    const { handleMessageClick } = useCreateChat();

    const statsData = mapProfileStatsToCards(userData?.stats);

    useEffect(() => {
        if (error) {
            showAlert(error, "error");
        }
    }, [error]);

    if (loading || !userData) return <Loader />;

    return (
        <main className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-gray-800 dark:text-gray-100">
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
                                    onChange={(e) => handleAvatarChange(e.target.files?.[0])}
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
                            <span
                                className="cursor-pointer px-2 py-1 rounded-lg 
               hover:bg-gray-200 dark:hover:bg-gray-700 
               transition-colors"
                                onClick={() => navigate(`/users/${userData.id}/followers`)}
                            >
                                <strong>{userData.followersCount}</strong> {t("profile.followers")}
                            </span>

                            <span
                                className="cursor-pointer px-2 py-1 rounded-lg 
               hover:bg-gray-200 dark:hover:bg-gray-700 
               transition-colors"
                                onClick={() => navigate(`/users/${userData.id}/following`)}
                            >
                                <strong>{userData.followingCount}</strong> {t("profile.following")}
                            </span>
                        </div>



                        {isMyProfile ? (
                            <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-3">
                                <button
                                    onClick={() => navigate(`/users/${userData.id}/settings#profile`)}
                                    className="mt-6 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition">
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

                                <button
                                    className="px-5 py-2 rounded-xl bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium transition"
                                    onClick={() => handleMessageClick(userData.id, currentUser?.id)}
                                >
                                    Message
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section>
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Статистика активности
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Активность за последний месяц
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsData.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>
            </section>
        </main>
    );
};
