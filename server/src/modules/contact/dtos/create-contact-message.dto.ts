import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ContactSubject } from '@/database/entities/contact-message.entity';

export class CreateContactMessageDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsEnum(ContactSubject)
    subject: ContactSubject;

    @IsString()
    @IsNotEmpty()
    @MaxLength(2000)
    message: string;
}