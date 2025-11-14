import {
    IsString,
    IsOptional,
    IsArray,
    ArrayNotEmpty,
} from 'class-validator';

export class CreateArticleDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;  

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    hashtags?: string[];
}