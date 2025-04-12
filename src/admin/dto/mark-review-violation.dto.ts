import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class MarkReviewViolationDto {
    @ApiProperty({
        example: true,
        description: 'Mark review as violated or not',
    })
    @IsBoolean()
    isViolated: boolean;
}
