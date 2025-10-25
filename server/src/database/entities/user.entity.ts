import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
} from 'typeorm';

export enum UserRole {
    USER = 'user',
    PREMIUM = 'premium',
    ADMIN = 'admin',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    userName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: string;

    @Column({ type: 'text', nullable: true, default: null })
    avatar: string | null;

    @Column({ default: false })
    isBlocked: boolean;

    @Column({ type: 'text', nullable: true })
    bio?: string;

    @Column({ type: 'varchar', nullable: true })
    location?: string;

    @Column({ type: 'varchar', nullable: true })
    website?: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ default: 0 })
    followersCount: number;

    @Column({ default: 0 })
    followingCount: number;

    @BeforeInsert()
    generateUsername() {
        if (!this.userName) {
            const random = Math.floor(1000 + Math.random() * 9000);
            const base = this.firstName ? this.firstName.toLowerCase() : 'user';
            this.userName = `@${base}${random}`;
        }
    }
}
