import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export enum PaymentMethod {
    vnpay = 'vnpay',
    zalopay = 'zalopay',
    momopay = 'momopay',
}

export class CreatePaymentDto {
    @IsUUID()
    appointmentId: string;

    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    method: PaymentMethod;
}
