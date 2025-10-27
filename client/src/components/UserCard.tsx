import { type FC } from "react";
import { type UserCardProps } from "@/shared/types/userTypes";
import { Link } from "react-router-dom";

export const UserCard: FC<UserCardProps> = ({
    id,
    firstName,
    lastName,
    userName,
    avatar,
}) => {
    return (
        <Link
            to={`/users/${id}`}
            className="self-stretch min-h-16 px-4 py-2 bg-slate-50 dark:bg-darkbg inline-flex justify-start items-center gap-4 rounded-xl"
        >
            <img
                className="w-14 h-14 relative rounded-3xl object-cover"
                src={avatar || `https://i.pravatar.cc/56?u=${userName}`}
                alt={userName}
            />
            <div className="inline-flex flex-col justify-center items-start">
                <div className="flex flex-col justify-start items-start overflow-hidden">
                    <div className="justify-start text-neutral-900 dark:text-gray-100 text-base font-medium leading-6">
                        {firstName} {lastName}
                    </div>
                </div>
                <div className="w-24 flex flex-col justify-start items-start overflow-hidden">
                    <div className="self-stretch justify-start text-slate-500 dark:text-gray-400 text-sm font-normal leading-5">
                        @{userName}
                    </div>
                </div>
            </div>
        </Link>
    );
};
