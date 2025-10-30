import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { Repository, FindOptionsWhere } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as path from "path";
import * as fs from "fs";

import { User } from "@/database/entities/user.entity";
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
        private readonly relationRepository: Repository<UserRelation>
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

    async getUserProfileData(
        targetUserId: number,
        currentUserId?: number
    ) {
        const user = await this.userRepository.findOne({
            where: { id: targetUserId },
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const { password, ...safeUser } = user;

        let isFollowing = false;

        if (currentUserId) {
            const relation = await this.relationRepository
                .createQueryBuilder('r')
                .select('r.id')
                .where('r."sourceUserId" = :sourceId', { sourceId: currentUserId })
                .andWhere('r."targetUserId" = :targetId', { targetId: targetUserId })
                .andWhere('r.type::text = :type', { type: RelationType.FOLLOW })
                .getOne();

            isFollowing = !!relation;
        }

        // Подсчёт подписчиков (кто подписан на targetUser)
        const followersCount = await this.relationRepository
            .createQueryBuilder('r')
            .where('r."targetUserId" = :targetId', { targetId: targetUserId })
            .andWhere('r.type::text = :type', { type: RelationType.FOLLOW })
            .getCount();

        // Подсчёт подписок (на кого targetUser подписан)
        const followingCount = await this.relationRepository
            .createQueryBuilder('r')
            .where('r."sourceUserId" = :sourceId', { sourceId: targetUserId })
            .andWhere('r.type::text = :type', { type: RelationType.FOLLOW })
            .getCount();

        return {
            ...safeUser,
            isFollowing,
            followersCount: followersCount,
            followingCount: followingCount,
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
}