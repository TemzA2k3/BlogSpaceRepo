import { IsEmail, IsString, MinLength } from 'class-validator';
import { PASSWORD_MIN_LENGTH, NAME_MIN_LENGTH } from '@/shared/constants/constants';

export class CreateUserDto {
    @IsString()
    @MinLength(NAME_MIN_LENGTH)
    firstName: string;

    @IsString()
    @MinLength(NAME_MIN_LENGTH)
    lastName: string;

    @IsEmail()
    email: string;

    @MinLength(PASSWORD_MIN_LENGTH)
    password: string;
}