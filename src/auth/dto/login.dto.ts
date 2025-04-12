import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: '0384623506',
        description: 'Vietnamese phone number',
    })
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: string;

    @ApiProperty({
        example: 'password123',
        description: 'Plain text password',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
