import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum Role {
    patient = 'patient',
    doctor = 'doctor',
    admin = 'admin',
}

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}
