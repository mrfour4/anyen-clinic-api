import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePrescriptionDto {
    @ApiProperty({
        example: '4170bcb8-2979-4624-918f-7d9a7fab1bcc',
        description: 'Appointment ID to associate prescription with',
    })
    @IsNotEmpty()
    @IsString()
    appointmentId: string;
}
