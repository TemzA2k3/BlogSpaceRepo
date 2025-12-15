import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { File as MulterFile } from 'multer';

import { Post } from '@/database/entities/post.entity';
import { User, UserRole } from '@/database/entities/user.entity';
import { UserRelation, RelationType } from '@/database/entities/user-relation.entity';
import { Hashtag } from '@/database/entities/hashtag.entity';
import { PostLike } from '@/database/entities/post-likes.entity';
import { PostSave } from '@/database/entities/post-saves.entity';
import { Comment } from '@/database/entities/comment.entity';

import { CreatePostDto } from '@/modules/posts/dtos/create-post.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Hashtag)
        private readonly hashtagRepository: Repository<Hashtag>,

        @InjectRepository(UserRelation)
        private readonly userRelationRepository: Repository<UserRelation>,

        @InjectRepository(PostLike)
        private readonly postLikeRepository: Repository<PostLike>,

        @InjectRepository(PostSave)
        private readonly postSaveRepository: Repository<PostSave>,

        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
    ) { }


    private async mapToUsersPosts(post: Post, currentUserId?: number): Promise<any> {
        const [likes, saves, parentCommentsCount] = await Promise.all([
            this.postLikeRepository.find({ where: { post: { id: post.id } }, relations: ['user'] }),
            this.postSaveRepository.find({ where: { post: { id: post.id } }, relations: ['user'] }),
            this.commentRepository.count({ where: { post: { id: post.id }, parent: IsNull() } })
        ]);

        const likedByCurrentUser = currentUserId ? likes.some(like => like.user.id === currentUserId) : false;
        const savedByCurrentUser = currentUserId ? saves.some(save => save.user.id === currentUserId) : false;

        return {
            id: post.id,
            content: post.content,
            hashtags: post.hashtags?.map(h => ({ id: h.id, name: h.name })) || [],
            likes: likes.length,
            comments: parentCommentsCount,
            saved: saves.length,
            image: post.image ?? null,
            createdAt: post.createdAt,
            userId: post.user.id,
            avatar: post.user.avatar,
            firstName: post.user.firstName,
            lastName: post.user.lastName,
            username: post.user.userName,
            likedByCurrentUser,
            savedByCurrentUser,
        };
    }


    async createPost(userId: number, postData: CreatePostDto, image?: MulterFile) {
        const { content, hashtags = [] } = postData;

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const hashtagEntities: Hashtag[] = [];
        for (const tagName of hashtags) {
            const lowerTag = tagName.toLowerCase().trim();
            if (!lowerTag) continue;

            let hashtag = await this.hashtagRepository.findOne({ where: { name: lowerTag } });
            if (!hashtag) {
                hashtag = this.hashtagRepository.create({ name: lowerTag });
                await this.hashtagRepository.save(hashtag);
            }
            hashtagEntities.push(hashtag);
        }

        const relativeImagePath = image ? `/uploads/posts/${image.filename}` : undefined;

        const newPost = this.postRepository.create({ content, image: relativeImagePath, user, hashtags: hashtagEntities });
        await this.postRepository.save(newPost);

        const savedPost = await this.postRepository.findOne({
            where: { id: newPost.id },
            relations: ['user', 'hashtags'],
        });
        if (!savedPost) throw new NotFoundException('Post not found after creation');

        return this.mapToUsersPosts(savedPost, userId);
    }

    async findAll(userId?: number) {
        let followedUserIds: number[] = [];

        if (userId) {
            const followRelations = await this.userRelationRepository.find({
                where: { sourceUser: { id: userId }, type: RelationType.FOLLOW },
                relations: ['targetUser'],
            });
            followedUserIds = followRelations.map(rel => rel.targetUser.id);
            followedUserIds.push(userId);
        }

        const posts = await this.postRepository.find({
            where: userId ? { user: { id: In(followedUserIds) } } : {},
            relations: ['user', 'hashtags'],
            order: { createdAt: 'DESC' },
        });

        return Promise.all(posts.map(post => this.mapToUsersPosts(post, userId)));
    }


    async findOne(postId: number, currentUserId?: number) {
        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: ['user', 'hashtags'],
        });

        if (!post) throw new NotFoundException('Post not found');

        return this.mapToUsersPosts(post, currentUserId);
    }

    async deletePost(postId: number, userId: number) {
        const post = await this.postRepository.findOne({ where: { id: postId }, relations: ['user', 'hashtags'] });
        if (!post) throw new NotFoundException('Post not found');

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        if (post.user.id !== user.id && user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('You are not allowed to delete this post');
        }

        await this.postRepository.remove(post);
        return { message: 'Post successfully deleted', postId };
    }

    async toggleLike(postId: number, userId: number) {
        const post = await this.postRepository.findOne({ where: { id: postId }, relations: ['user', 'hashtags'] });
        if (!post) throw new NotFoundException('Post not found');

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const existingLike = await this.postLikeRepository.findOne({ where: { post: { id: postId }, user: { id: userId } } });
        if (existingLike) await this.postLikeRepository.remove(existingLike);
        else await this.postLikeRepository.save(this.postLikeRepository.create({ post, user }));

        return this.mapToUsersPosts(post, userId);
    }

    async toggleSave(postId: number, userId: number) {
        const post = await this.postRepository.findOne({ where: { id: postId }, relations: ['user', 'hashtags'] });
        if (!post) throw new NotFoundException('Post not found');

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const existingSave = await this.postSaveRepository.findOne({ where: { post: { id: postId }, user: { id: userId } } });
        if (existingSave) await this.postSaveRepository.remove(existingSave);
        else await this.postSaveRepository.save(this.postSaveRepository.create({ post, user }));

        return this.mapToUsersPosts(post, userId);
    }
}
