import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateEmotionDto {
    @ApiProperty({
        example: 'happy',
        description: 'Emotion status: happy | sad | stressful | comfortable',
        enum: ['happy', 'sad', 'stressful', 'comfortable'],
    })
    @IsIn(['happy', 'sad', 'stressful', 'comfortable'])
    emotionStatus: string;

    @ApiPropertyOptional({
        example: 'Today I feel very good!',
        description: 'Optional description of your emotion',
    })
    @IsOptional()
    @IsString()
    description?: string;
}
