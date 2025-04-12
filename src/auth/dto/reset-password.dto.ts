import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({ example: '0384623506' })
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: string;

    @ApiProperty({ example: '499138' })
    @IsString()
    @IsNotEmpty()
    otp: string;

    @ApiProperty({ example: 'newPassword' })
    @IsString()
    @IsNotEmpty()
    newPassword: string;
}
