import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
} from 'class-validator';

export enum Role {
    patient = 'patient',
    doctor = 'doctor',
    admin = 'admin',
}

export class RegisterDto {
    @ApiProperty({
        example: '0384623506',
        description: 'Vietnamese phone number',
    })
    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber('VN')
    phone: string;

    @ApiProperty({
        example: 'password123',
        description: 'Plain text password',
    })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({
        example: 'doctor',
        required: false,
        enum: Role,
        description:
            'Optional role. If omitted, defaults to patient. Only one admin allowed.',
    })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}
