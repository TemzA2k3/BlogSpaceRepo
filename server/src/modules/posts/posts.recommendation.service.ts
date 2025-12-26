import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { Post } from "@/database/entities/post.entity";
import { User } from "@/database/entities/user.entity";
import { UserRelation, RelationType } from "@/database/entities/user-relation.entity";

@Injectable()
export class PostsRecommendationsService {
    constructor(
        @InjectRepository(Post) private postRepository: Repository<Post>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UserRelation) private relationRepository: Repository<UserRelation>,
    ) {}

    async getTrendingTopics(limit = 5) {
        const posts = await this.postRepository
            .createQueryBuilder("post")
            .leftJoinAndSelect("post.hashtags", "hashtag")
            .getMany();

        const tagCount: Record<string, number> = {};

        posts.forEach(post => {
            post.hashtags?.forEach(tag => {
                tagCount[tag.name] = (tagCount[tag.name] || 0) + 1;
            });
        });

        const trendingTopics = Object.entries(tagCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([tag, count]) => ({ tag, count }));

        return trendingTopics;
    }

    async getSuggestedUsers(currentUserId?: number, limit = 3) {
        if (currentUserId) {
            // Сначала получаем пользователей, на которых текущий юзер уже подписан
            const followingIds = await this.relationRepository
                .createQueryBuilder("relation")
                .select("relation.targetUserId")
                .where("relation.sourceUserId = :currentUserId", { currentUserId })
                .andWhere("relation.type = :type", { type: RelationType.FOLLOW })
                .getRawMany<{ targetUserId: number }>();
    
            const excludedIds = followingIds.map(f => f.targetUserId);
            excludedIds.push(currentUserId);
    
            const users = await this.userRepository
                .createQueryBuilder("user")
                .where("user.id NOT IN (:...excludedIds)", { excludedIds })
                .orderBy("RANDOM()")
                .limit(limit)
                .getMany();
    
            return users.map(u => ({
                id: u.id,
                username: u.userName,
                avatar: u.avatar,
                firstName: u.firstName,
                lastName: u.lastName
            }));
        } else {
            const users = await this.userRepository
                .createQueryBuilder("user")
                .leftJoin("user.relationsTo", "followers", "followers.type = :type", { type: RelationType.FOLLOW })
                .loadRelationCountAndMap("user.followersCount", "user.relationsTo", "followersCount", qb =>
                    qb.andWhere("followers.type = :type", { type: RelationType.FOLLOW })
                )
                .orderBy("followersCount", "DESC")
                .limit(limit)
                .getMany();
    
            return users.map(u => ({
                id: u.id,
                username: u.userName,
                avatar: u.avatar,
                firstName: u.firstName,
                lastName: u.lastName
            }));
        }
    }
    

    async getRecommendations(currentUserId?: number) {
        const [trendingTopics, suggestedUsers] = await Promise.all([
            this.getTrendingTopics(),
            this.getSuggestedUsers(currentUserId),
        ]);

        return { trendingTopics, suggestedUsers };
    }
}
