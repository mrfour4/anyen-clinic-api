import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdatePatientProfileDto {
    @IsOptional()
    @IsString()
    fullName?: string;

    @IsOptional()
    @IsDateString()
    dateOfBirth?: string;

    @IsOptional()
    @IsString()
    gender?: 'male' | 'female' | 'other';

    @IsOptional()
    @IsString()
    anonymousName?: string;

    @IsOptional()
    @IsString()
    medicalHistory?: string;

    @IsOptional()
    @IsString()
    allergies?: string;
}
