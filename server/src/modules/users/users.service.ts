import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { 
    Repository, 
    FindOptionsWhere, 
    ILike,
    MoreThanOrEqual, 
    Between  
} from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as path from "path";
import * as fs from "fs";

import { User } from "@/database/entities/user.entity";
import { Post } from "@/database/entities/post.entity";
import { Comment } from "@/database/entities/comment.entity";
import { PostLike } from "@/database/entities/post-likes.entity";
import { PostSave } from "@/database/entities/post-saves.entity";
import { Chat } from "@/database/entities/chat.entity"; 
import { Article } from "@/database/entities/article.entity";

import { PasswordService } from "@/common/services/password.service";

import {
    RelationType,
    UserRelation,
} from "@/database/entities/user-relation.entity";

import { ProfileStatsHelper } from "./helpers/profile-stats.helper";
import { UpdateSettingsDto } from "./dtos/update-user.dto";
import { ChangePasswordDto } from "./dtos/change-password.dto";


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UserRelation) private relationRepository: Repository<UserRelation>,
        @InjectRepository(Post) private postRepository: Repository<Post>,
        @InjectRepository(Chat) private chatRepository: Repository<Chat>,
        @InjectRepository(Article) private articleRepository: Repository<Article>,
        @InjectRepository(PostLike) private postLikeRepository: Repository<PostLike>,
        @InjectRepository(Comment) private commentRepository: Repository<Comment>,
        private readonly statsHelper: ProfileStatsHelper,
        private readonly passwordService: PasswordService,
    ) {}

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
        const { lastMonth, twoMonthsAgo } = this.statsHelper.getMonthRanges();
      
        const userPromise = this.userRepository.findOne({
          where: { id: targetUserId },
        });
      
        const isFollowingPromise = currentUserId
          ? this.relationRepository.exist({
              where: {
                sourceUser: { id: currentUserId },
                targetUser: { id: targetUserId },
                type: RelationType.FOLLOW,
              },
            })
          : Promise.resolve(false);
      
        const [
          user,
          isFollowing,
          followersCount,
          followingCount,
      
          postsThisMonth,
          postsLastMonth,
      
          newFollowersThisMonth,
          newFollowersLastMonth,
      
          newFollowingThisMonth,
          newFollowingLastMonth,
      
          articlesThisMonth,
          articlesLastMonth,
        ] = await Promise.all([
          userPromise,
          isFollowingPromise,
      
          this.relationRepository.count({
            where: { targetUser: { id: targetUserId }, type: RelationType.FOLLOW },
          }),
          this.relationRepository.count({
            where: { sourceUser: { id: targetUserId }, type: RelationType.FOLLOW },
          }),
      
          this.postRepository.count({
            where: {
              user: { id: targetUserId },
              createdAt: MoreThanOrEqual(lastMonth),
            },
          }),
          this.postRepository.count({
            where: {
              user: { id: targetUserId },
              createdAt: Between(twoMonthsAgo, lastMonth),
            },
          }),
      
          this.relationRepository.count({
            where: {
              targetUser: { id: targetUserId },
              type: RelationType.FOLLOW,
              createdAt: MoreThanOrEqual(lastMonth),
            },
          }),
          this.relationRepository.count({
            where: {
              targetUser: { id: targetUserId },
              type: RelationType.FOLLOW,
              createdAt: Between(twoMonthsAgo, lastMonth),
            },
          }),
      
          this.relationRepository.count({
            where: {
              sourceUser: { id: targetUserId },
              type: RelationType.FOLLOW,
              createdAt: MoreThanOrEqual(lastMonth),
            },
          }),
          this.relationRepository.count({
            where: {
              sourceUser: { id: targetUserId },
              type: RelationType.FOLLOW,
              createdAt: Between(twoMonthsAgo, lastMonth),
            },
          }),
      
          this.articleRepository.count({
            where: {
              user: { id: targetUserId },
              createdAt: MoreThanOrEqual(lastMonth),
            },
          }),
          this.articleRepository.count({
            where: {
              user: { id: targetUserId },
              createdAt: Between(twoMonthsAgo, lastMonth),
            },
          }),
        ]);
      
        if (!user) throw new NotFoundException("User not found");
      
        const { password, ...safeUser } = user;
      
        const [likesThisMonth, likesLastMonth, commentsThisMonth, commentsLastMonth] =
          await Promise.all([
            this.postLikeRepository
              .createQueryBuilder("like")
              .innerJoin("like.post", "post")
              .where("post.user = :userId", { userId: targetUserId })
              .andWhere("like.createdAt >= :lastMonth", { lastMonth })
              .getCount(),
      
            this.postLikeRepository
              .createQueryBuilder("like")
              .innerJoin("like.post", "post")
              .where("post.user = :userId", { userId: targetUserId })
              .andWhere("like.createdAt >= :twoMonthsAgo", { twoMonthsAgo })
              .andWhere("like.createdAt < :lastMonth", { lastMonth })
              .getCount(),
      
            this.commentRepository
              .createQueryBuilder("comment")
              .innerJoin("comment.post", "post")
              .where("post.user = :userId", { userId: targetUserId })
              .andWhere("comment.createdAt >= :lastMonth", { lastMonth })
              .getCount(),
      
            this.commentRepository
              .createQueryBuilder("comment")
              .innerJoin("comment.post", "post")
              .where("post.user = :userId", { userId: targetUserId })
              .andWhere("comment.createdAt >= :twoMonthsAgo", { twoMonthsAgo })
              .andWhere("comment.createdAt < :lastMonth", { lastMonth })
              .getCount(),
          ]);
      
        const stats = {
          postsThisMonth: {
            value: postsThisMonth,
            change: this.statsHelper.calculateChange(postsThisMonth, postsLastMonth),
          },
          newFollowers: {
            value: newFollowersThisMonth,
            change: this.statsHelper.calculateChange(newFollowersThisMonth, newFollowersLastMonth),
          },
          newFollowing: {
            value: newFollowingThisMonth,
            change: this.statsHelper.calculateChange(newFollowingThisMonth, newFollowingLastMonth),
          },
          articlesPublished: {
            value: articlesThisMonth,
            change: this.statsHelper.calculateChange(articlesThisMonth, articlesLastMonth),
          },
          likesReceived: {
            value: likesThisMonth,
            change: this.statsHelper.calculateChange(likesThisMonth, likesLastMonth),
          },
          commentsReceived: {
            value: commentsThisMonth,
            change: this.statsHelper.calculateChange(commentsThisMonth, commentsLastMonth),
          },
        };
      
        return {
          ...safeUser,
          isFollowing,
          followersCount,
          followingCount,
          stats,
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

    async deleteAvatar(userId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User not found");

        if (user.avatar && user.avatar.startsWith("/uploads/avatars/")) {
            const avatarPath = path.join(process.cwd(), user.avatar);
            try {
                if (fs.existsSync(avatarPath)) fs.unlinkSync(avatarPath);
            } catch (err) {
                console.warn(`⚠️ Не удалось удалить аватар: ${err.message}`);
            }
        }

        user.avatar = null;
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

    async getUserSettings(userId: number) {
        const user = await this.userRepository.findOne({ 
            where: { id: userId },
            select: [
                'id',
                'firstName',
                'lastName',
                'userName',
                'email',
                'role',
                'avatar',
                'isBlocked',
                'bio',
                'location',
                'website',
                'isPublicProfile',
                'whoCanMessage',
                'displayLanguage',
                'createdAt',
            ],
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        return user;
    }

    async updateUserSettings(userId: number, dto: UpdateSettingsDto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        if (dto.userName && dto.userName !== user.userName) {
            const existingUser = await this.userRepository.findOne({
                where: { userName: dto.userName },
            });

            if (existingUser) {
                throw new BadRequestException("Username is already taken");
            }
        }

        Object.keys(dto).forEach((key) => {
            if (dto[key] !== undefined) {
                user[key] = dto[key];
            }
        });

        await this.userRepository.save(user);

        const { password, ...safeUser } = user;
        return safeUser;
    }

    async changePassword(userId: number, dto: ChangePasswordDto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
    
        if (!user) {
            throw new NotFoundException("User not found");
        }
    
        const isPasswordValid = await this.passwordService.compare(dto.currentPassword, user.password);
    
        if (!isPasswordValid) {
            throw new BadRequestException("Current password is incorrect");
        }
    
        const isSamePassword = await this.passwordService.compare(dto.newPassword, user.password);
    
        if (isSamePassword) {
            throw new BadRequestException("New password must be different from current password");
        }
    
        user.password = await this.passwordService.hash(dto.newPassword);
        await this.userRepository.save(user);
    }

    async deleteAccount(userId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        if (user.avatar && user.avatar.startsWith("/uploads/avatars/")) {
            const avatarPath = path.join(process.cwd(), user.avatar);
            try {
                if (fs.existsSync(avatarPath)) fs.unlinkSync(avatarPath);
            } catch (err) {
                console.warn(`⚠️ Не удалось удалить аватар: ${err.message}`);
            }
        }

        await this.userRepository.remove(user);
    }
}