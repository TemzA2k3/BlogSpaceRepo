import { 
    IsString, 
    IsOptional, 
    IsArray, 
    ArrayNotEmpty, 
    ArrayUnique 
} from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  hashtags?: string[];
}