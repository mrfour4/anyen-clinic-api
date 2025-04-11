import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class VerifyOtpDto {
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: string;

    @IsString()
    @IsNotEmpty()
    otp: string;
}
