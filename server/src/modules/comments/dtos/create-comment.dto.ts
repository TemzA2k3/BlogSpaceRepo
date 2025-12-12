import { 
    IsNumber,
    IsOptional,
    IsString 
} from 'class-validator';

export class CreateUserDto {
    @IsString()
    content: string;

    @IsOptional()
    @IsNumber()
    parentId?: number;
}
