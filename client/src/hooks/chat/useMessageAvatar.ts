import { useMemo } from 'react';

import { getAvatarUrl } from '@/shared/utils/getImagesUrls';

export const useMessageAvatar = (msg: any, currentUser: any, selectedUser: any) => {
    const avatarSrc = useMemo(() => {
        return msg.sender === "me"
            ? getAvatarUrl(currentUser?.firstName || "", currentUser?.lastName || "", currentUser?.avatar || "")
            : getAvatarUrl(selectedUser?.firstName || "", selectedUser?.lastName || "", selectedUser?.avatar || "");
    }, [msg, currentUser, selectedUser]);

    const avatarAlt = useMemo(() => {
        return msg.sender === "me"
            ? currentUser?.firstName || "Me"
            : selectedUser?.firstName || "User";
    }, [msg, currentUser, selectedUser]);

    return { avatarSrc, avatarAlt };
};
