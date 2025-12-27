import { IsEnum, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { ReportReason } from '@/database/entities/report.entity';

export class CreateReportDto {
    @IsInt()
    postId: number;

    @IsEnum(ReportReason)
    reason: ReportReason;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;
}