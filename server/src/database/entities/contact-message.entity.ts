import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

export enum ContactSubject {
    GENERAL = 'general',
    TECHNICAL = 'technical',
    BILLING = 'billing',
    PARTNERSHIP = 'partnership',
    FEEDBACK = 'feedback',
    OTHER = 'other',
}

export enum ContactStatus {
    NEW = 'new',
    IN_PROGRESS = 'in_progress',
    RESOLVED = 'resolved',
    CLOSED = 'closed',
}

@Entity('contact_messages')
export class ContactMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({ type: 'enum', enum: ContactSubject })
    subject: ContactSubject;

    @Column({ type: 'text' })
    message: string;

    @Column({ type: 'enum', enum: ContactStatus, default: ContactStatus.NEW })
    status: ContactStatus;

    @Column({ nullable: true })
    adminNotes?: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}