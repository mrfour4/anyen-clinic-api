import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export enum PaymentMethod {
    vnpay = 'vnpay',
    zalopay = 'zalopay',
    momopay = 'momopay',
}

export class CreatePaymentDto {
    @ApiProperty({
        example: '4170bcb8-2979-4624-918f-7d9a7fab1bcc',
        description: 'Appointment ID for which payment is made',
    })
    @IsUUID()
    appointmentId: string;

    @ApiProperty({
        example: 'vnpay',
        enum: PaymentMethod,
        description: 'Payment method to simulate (vnpay, zalopay, momopay)',
    })
    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    method: PaymentMethod;
}
