import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { Repository, FindOptionsWhere, ILike } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as path from "path";
import * as fs from "fs";

import { User } from "@/database/entities/user.entity";
import { Post } from "@/database/entities/post.entity";
import { PostLike } from "@/database/entities/post-likes.entity";
import { PostSave } from "@/database/entities/post-saves.entity";

import {
    RelationType,
    UserRelation,
} from "@/database/entities/user-relation.entity";


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(UserRelation)
        private readonly relationRepository: Repository<UserRelation>,

        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

        @InjectRepository(PostLike)
        private readonly postLikeRepository: Repository<PostLike>,

        @InjectRepository(PostSave)
        private readonly postSaveRepository: Repository<PostSave>,
    ) { }

    findByEmail(email: string) {
        return this.userRepository.findOne({ where: { email } });
    }

    async findOneByParams(params: FindOptionsWhere<User>) {
        const user = await this.userRepository.findOne({ where: params });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const { password, ...safeUser } = user;

        return safeUser;
    }

    async setUserOnline(userId: number) {
        await this.userRepository.update(userId, { online: true });
    }

    async setUserOffline(userId: number) {
        await this.userRepository.update(userId, { online: false });
    }

    async getUserProfileData(targetUserId: number, currentUserId?: number) {
        const user = await this.userRepository.findOne({ where: { id: targetUserId } });
        if (!user) throw new NotFoundException('User not found');

        const { password, ...safeUser } = user;

        const isFollowing = currentUserId
            ? !!(await this.relationRepository.findOne({
                where: {
                    sourceUser: { id: currentUserId },
                    targetUser: { id: targetUserId },
                    type: RelationType.FOLLOW,
                },
            }))
            : false;

        const [followersCount, followingCount] = await Promise.all([
            this.relationRepository.count({ where: { targetUser: { id: targetUserId }, type: RelationType.FOLLOW } }),
            this.relationRepository.count({ where: { sourceUser: { id: targetUserId }, type: RelationType.FOLLOW } }),
        ]);

        const posts = await this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.hashtags', 'hashtag')
            .where('post.userId = :userId', { userId: targetUserId })
            .orderBy('post.createdAt', 'DESC')
            .getMany();

        const postIds = posts.map(p => p.id);
        let likesMap: Record<number, { count: number; likedByCurrentUser: boolean }> = {};
        let savesMap: Record<number, { count: number; savedByCurrentUser: boolean }> = {};

        if (postIds.length) {
            const likes = await this.postLikeRepository
                .createQueryBuilder('like')
                .select('like.postId', 'postId')
                .addSelect('COUNT(like.id)', 'likesCount')
                .addSelect(`SUM(CASE WHEN like.userId = :currentUserId THEN 1 ELSE 0 END)`, 'likedByCurrentUser')
                .where('like.postId IN (:...postIds)', { postIds })
                .setParameter('currentUserId', currentUserId || 0)
                .groupBy('like.postId')
                .getRawMany();

            likes.forEach(like => {
                likesMap[like.postId] = { count: Number(like.likesCount), likedByCurrentUser: Number(like.likedByCurrentUser) > 0 };
            });

            const saves = await this.postSaveRepository
                .createQueryBuilder('save')
                .select('save.postId', 'postId')
                .addSelect('COUNT(save.id)', 'savedCount')
                .addSelect(`SUM(CASE WHEN save.userId = :currentUserId THEN 1 ELSE 0 END)`, 'savedByCurrentUser')
                .where('save.postId IN (:...postIds)', { postIds })
                .setParameter('currentUserId', currentUserId || 0)
                .groupBy('save.postId')
                .getRawMany();

            saves.forEach(save => {
                savesMap[save.postId] = { count: Number(save.savedCount), savedByCurrentUser: Number(save.savedByCurrentUser) > 0 };
            });
        }

        const postsWithData = posts.map(post => ({
            id: post.id,
            content: post.content,
            comments: post.comments,
            saved: savesMap[post.id]?.count || 0,
            savedByCurrentUser: savesMap[post.id]?.savedByCurrentUser || false,
            image: post.image ?? null,
            createdAt: post.createdAt,
            hashtags: post.hashtags?.map(h => ({ id: h.id, name: h.name })) || [],
            userId: targetUserId,
            avatar: user.avatar,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.userName,
            likes: likesMap[post.id]?.count || 0,
            likedByCurrentUser: likesMap[post.id]?.likedByCurrentUser || false,
        }));

        return { ...safeUser, isFollowing, followersCount, followingCount, posts: postsWithData };
    }

    create(data: Partial<User>) {
        const user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }

    async updateAvatar(userId: number, filename: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new Error("User not found");

        if (user.avatar && user.avatar.startsWith("/uploads/avatars/")) {
            const oldPath = path.join(process.cwd(), user.avatar);
            try {
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            } catch (err) {
                console.warn(`⚠️ Не удалось удалить старый аватар: ${err.message}`);
            }
        }

        user.avatar = `/uploads/avatars/${filename}`;
        await this.userRepository.save(user);

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async followUser(sourceId: number, targetId: number) {
        const [sourceUser, targetUser] = await Promise.all([
            this.userRepository.findOneBy({ id: sourceId }),
            this.userRepository.findOneBy({ id: targetId }),
        ]);

        if (!sourceUser) throw new NotFoundException("Source user not found");
        if (!targetUser) throw new NotFoundException("Target user not found");

        const existing = await this.relationRepository.findOne({
            where: { sourceUser: { id: sourceId }, targetUser: { id: targetId } },
        });

        if (existing) throw new BadRequestException("You have already subscribed!");

        const relation = this.relationRepository.create({
            sourceUser,
            targetUser,
            type: RelationType.FOLLOW,
        });

        await this.relationRepository.save(relation);
    }

    async unfollowUser(sourceId: number, targetId: number) {
        if (sourceId === targetId) throw new BadRequestException("You cannot unfollow yourself");

        const relation = await this.relationRepository.findOne({
            where: {
                sourceUser: { id: sourceId },
                targetUser: { id: targetId },
                type: RelationType.FOLLOW,
            },
        });

        if (!relation) throw new BadRequestException("You are not following this user");

        await this.relationRepository.remove(relation);
    }

    async getUsersBySearch(query: string, offset: number = 0, limit: number = 20) {
        if (!query) return [];

        const users = await this.userRepository.find({
            where: [
                { firstName: ILike(`%${query}%`) },
                { lastName: ILike(`%${query}%`) },
                { userName: ILike(`%${query}%`) },
            ],
            select: ['id', 'firstName', 'lastName', 'userName', 'avatar'],
            skip: offset,
            take: limit,
            order: { id: 'DESC' },
        });

        return users;
    }


    async getUserFollowing(userId: number, offset: number, limit: number) {
        return this.getUserSubs(userId, "targetUser", offset, limit)
    }

    getUserFollowers(userId: number, offset: number, limit: number) {
        return this.getUserSubs(userId, "sourceUser", offset, limit)
    }

    private async getUserSubs(
        userId: number,
        relation: "sourceUser" | "targetUser",
        offset: number,
        limit: number,
    ) {
        const whereCondition =
            relation === "sourceUser"
                ? { targetUser: { id: userId }, type: RelationType.FOLLOW }
                : { sourceUser: { id: userId }, type: RelationType.FOLLOW };

        const relations = await this.relationRepository.find({
            where: whereCondition,
            relations: [relation],
            skip: offset,
            take: limit,
        });

        return relations.map(rel => {
            const user = rel[relation];
            return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                avatar: user.avatar,
            };
        });
    }


    async updatePassword(userId: number, newPassword: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User not found");

        user.password = newPassword;
        await this.userRepository.save(user);

        const { password, ...safeUser } = user;
        return safeUser;
    }

}