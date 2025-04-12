import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateEmotionDto {
    @IsIn(['happy', 'sad', 'stressful', 'comfortable'])
    emotionStatus: string;

    @IsOptional()
    @IsString()
    description?: string;
}
