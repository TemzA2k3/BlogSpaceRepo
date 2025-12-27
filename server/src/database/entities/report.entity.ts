import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Post } from './post.entity';

export enum ReportReason {
    SPAM = 'spam',
    HARASSMENT = 'harassment',
    VIOLENCE = 'violence',
    MISINFORMATION = 'misinformation',
    HATE_SPEECH = 'hate_speech',
    INAPPROPRIATE = 'inappropriate',
    OTHER = 'other',
}

export enum ReportStatus {
    PENDING = 'pending',
    REVIEWED = 'reviewed',
    RESOLVED = 'resolved',
    DISMISSED = 'dismissed',
}

@Entity('reports')
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: ReportReason })
    reason: ReportReason;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.PENDING })
    status: ReportStatus;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ManyToOne(() => Post, post => post.reports, { onDelete: 'CASCADE' })
    post: Post;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
    user?: User;
}