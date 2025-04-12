import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class VerifyDoctorDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    specialization: string;

    @IsString()
    @IsNotEmpty()
    workplace: string;

    @IsNumber()
    @Min(0)
    experience: number;

    @IsString()
    workExperience: string;

    @IsString()
    educationHistory: string;

    @IsString()
    medicalLicense: string;
}
