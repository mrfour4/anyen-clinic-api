import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class PhoneDto {
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: string;
}
