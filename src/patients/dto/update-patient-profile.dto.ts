import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdatePatientProfileDto {
    @ApiPropertyOptional({ example: 'Nguyễn Văn A' })
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiPropertyOptional({ example: '1995-08-20' })
    @IsOptional()
    @IsDateString()
    dateOfBirth?: string;

    @ApiPropertyOptional({
        example: 'male',
        enum: ['male', 'female', 'other'],
    })
    @IsOptional()
    @IsString()
    gender?: 'male' | 'female' | 'other';

    @ApiPropertyOptional({
        example: 'Patient A',
    })
    @IsOptional()
    @IsString()
    anonymousName?: string;

    @ApiPropertyOptional({
        example: 'Diabetes, high blood pressure',
    })
    @IsOptional()
    @IsString()
    medicalHistory?: string;

    @ApiPropertyOptional({
        example: 'Pollen, seafood',
    })
    @IsOptional()
    @IsString()
    allergies?: string;
}
