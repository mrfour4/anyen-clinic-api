import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ModerateReviewDto {
    @ApiProperty({
        example: true,
        description: 'Flag whether the review violates policy',
    })
    @IsBoolean()
    isViolated: boolean;
}
