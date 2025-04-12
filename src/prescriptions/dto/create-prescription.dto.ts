import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePrescriptionDto {
    @IsNotEmpty()
    @IsString()
    appointmentId: string;
}
