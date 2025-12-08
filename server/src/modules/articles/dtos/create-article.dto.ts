import {
    IsString,
    IsOptional,
    IsArray,
    ArrayNotEmpty,
    ValidateNested,
    IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

import { SectionDto } from './sections.dto'


export class CreateArticleDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => SectionDto)
    sections: SectionDto[];

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    hashtags?: string[];
}
