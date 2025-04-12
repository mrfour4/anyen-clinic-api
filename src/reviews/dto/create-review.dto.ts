import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum RatingValue {
    VeryPleased = 'VeryPleased',
    Pleased = 'Pleased',
    Normal = 'Normal',
    Unpleased = 'Unpleased',
}

export class CreateReviewDto {
    @ApiProperty({
        example: '4170bcb8-2979-4624-918f-7d9a7fab1bcc',
        description: 'ID of the completed appointment',
    })
    @IsNotEmpty()
    @IsString()
    appointmentId: string;

    @ApiProperty({
        enum: RatingValue,
        example: RatingValue.Pleased,
        description: 'Rating given to the doctor',
    })
    @IsEnum(RatingValue)
    rating: RatingValue;

    @ApiProperty({
        example: 'Doctor was very attentive and understanding.',
        required: false,
    })
    @IsOptional()
    @IsString()
    comment?: string;
}
