import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class PhoneDto {
    @ApiProperty({
        example: '0384623506',
        description: 'Vietnamese phone number to receive OTP',
    })
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: string;
}
