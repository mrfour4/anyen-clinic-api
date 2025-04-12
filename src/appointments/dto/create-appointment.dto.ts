import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum AppointmentType {
    InPerson = 'InPerson',
    Online = 'Online',
}

export class CreateAppointmentDto {
    @IsNotEmpty()
    @IsDateString()
    appointmentTime: string;

    @IsNotEmpty()
    @IsString()
    doctorId: string;

    @IsNotEmpty()
    @IsString()
    question: string;

    @IsNotEmpty()
    @IsEnum(AppointmentType)
    appointmentType: AppointmentType;
}
