import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum RatingValue {
    VeryPleased = 'VeryPleased',
    Pleased = 'Pleased',
    Normal = 'Normal',
    Unpleased = 'Unpleased',
}

export class CreateReviewDto {
    @IsNotEmpty()
    @IsString()
    appointmentId: string;

    @IsEnum(RatingValue)
    rating: RatingValue;

    @IsOptional()
    @IsString()
    comment?: string;
}
