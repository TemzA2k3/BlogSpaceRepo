// client/src/components/UserItem.tsx
import type { ChatUser } from '@/shared/types/chat.types';
import { getAvatarUrl } from '@/shared/utils/getImagesUrls';

interface UserItemProps {
    user: ChatUser;
    isSelected: boolean;
    onClick: () => void;
}

export const UserItem: React.FC<UserItemProps> = ({ user, isSelected, onClick }) => {
    console.log(user);
    
    return (
        <button
            onClick={onClick}
            className={`w-full p-3 mb-1 flex items-start gap-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${isSelected ? 'bg-gray-200 dark:bg-gray-700' : ''
                }`}
        >
            <div className="relative">
                <img
                    src={getAvatarUrl(user.firstName, user.lastName, user.avatar)}
                    alt={user.firstName}
                    className="h-12 w-12 rounded-full object-cover" />
                {user.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-gray-50 dark:border-gray-800 rounded-full" />
                )}
            </div>
            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm truncate">{user.firstName} {user.lastName}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{user.time}</span>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.lastMessage}</p>
                    {user.unread > 0 && (
                        <span className="ml-2 bg-blue-600 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                            {user.unread}
                        </span>
                    )}
                </div>
            </div>
        </button>
    )
}
