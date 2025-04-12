import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class VerifyOtpDto {
    @ApiProperty({ example: '0384623506' })
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: string;

    @ApiProperty({ example: '901200' })
    @IsString()
    @IsNotEmpty()
    otp: string;
}
