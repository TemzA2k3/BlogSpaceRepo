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
        private readonly postLikeRepository: Repository<PostLike>
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
        const user = await this.userRepository.findOne({
            where: { id: targetUserId },
        });
    
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
            this.relationRepository.count({
                where: { targetUser: { id: targetUserId }, type: RelationType.FOLLOW },
            }),
            this.relationRepository.count({
                where: { sourceUser: { id: targetUserId }, type: RelationType.FOLLOW },
            }),
        ]);
    
        const posts = await this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.hashtags', 'hashtag')
            .where('post.userId = :userId', { userId: targetUserId })
            .orderBy('post.createdAt', 'DESC')
            .getMany();
    
        const postIds = posts.map(p => p.id);
    
        let likesMap: Record<number, { count: number; likedByCurrentUser: boolean }> = {};
    
        if (postIds.length > 0) {
            const likes = await this.postLikeRepository
                .createQueryBuilder('like')
                .select('like.postId', 'postId')
                .addSelect('COUNT(like.id)', 'likesCount')
                .addSelect(
                    `SUM(CASE WHEN like.userId = :currentUserId THEN 1 ELSE 0 END)`,
                    'likedByCurrentUser'
                )
                .where('like.postId IN (:...postIds)', { postIds })
                .setParameter('currentUserId', currentUserId || 0)
                .groupBy('like.postId')
                .getRawMany();
    
            likes.forEach(like => {
                likesMap[like.postId] = {
                    count: Number(like.likesCount),
                    likedByCurrentUser: Number(like.likedByCurrentUser) > 0,
                };
            });
            
        }
    
        const postsWithLikes = await Promise.all(
            posts.map(async post => {
              const likes = await this.postLikeRepository.find({
                where: { post: { id: post.id } },
                relations: ['user'],
              });
          
              const likedByCurrentUser = currentUserId
                ? likes.some(like => like.user.id === currentUserId)
                : false;
          
              return {
                id: post.id,
                content: post.content,
                comments: post.comments,
                saved: post.saved,
                image: post.image ?? null,
                createdAt: post.createdAt,
                hashtags: post.hashtags?.map(h => ({ id: h.id, name: h.name })) || [],
                userId: targetUserId,
                avatar: user.avatar,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.userName,
                likes: likes.length,
                likedByCurrentUser,
              };
            })
          );
          
    
        return {
            ...safeUser,
            isFollowing,
            followersCount,
            followingCount,
            posts: postsWithLikes,
        };
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

    async getUsersBySearch(query: string) {
        if (!query) return [];

        const users = await this.userRepository.find({
            where: [
                { firstName: ILike(`%${query}%`) },
                { lastName: ILike(`%${query}%`) },
                { userName: ILike(`%${query}%`) },
            ],
            select: ['id', 'firstName', 'lastName', 'userName', 'avatar'],
            take: 50,
        });

        return users;
    }

    async getUserFollowing(userId: number) {
        return this.getUserSubs(userId, "targetUser")
    }

    getUserFollowers(userId: number) {
        return this.getUserSubs(userId, "sourceUser")
    }

    private async getUserSubs(
        userId: number,
        relation: "sourceUser" | "targetUser"
    ) {
        const whereCondition =
            relation === "sourceUser"
                ? { targetUser: { id: userId }, type: RelationType.FOLLOW } // подписчики
                : { sourceUser: { id: userId }, type: RelationType.FOLLOW }; // подписки

        const relations = await this.relationRepository.find({
            where: whereCondition,
            relations: [relation],
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