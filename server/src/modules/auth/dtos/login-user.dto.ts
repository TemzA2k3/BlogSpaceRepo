import { IsBoolean, IsEmail, IsString, MinLength } from "class-validator";
import { PASSWORD_MIN_LENGTH } from "@/shared/constants";

export class LoginUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(PASSWORD_MIN_LENGTH)
    password: string;

    @IsBoolean()
    remember: boolean;
}