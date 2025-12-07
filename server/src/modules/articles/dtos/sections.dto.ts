import {
    IsString,
    IsOptional,
    IsNumber,
} from 'class-validator';

export class SectionDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    content?: string;
}