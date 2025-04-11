import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: string;

    @IsString()
    @IsNotEmpty()
    otp: string;

    @IsString()
    @IsNotEmpty()
    newPassword: string;
}
