import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export enum AppointmentStatus {
    Pending = 'Pending',
    Confirmed = 'Confirmed',
    Completed = 'Completed',
    Canceled = 'Canceled',
}

export class UpdateAppointmentDto {
    @IsOptional()
    @IsDateString()
    appointmentTime?: string;

    @IsOptional()
    @IsEnum(AppointmentStatus)
    status?: AppointmentStatus;

    @IsOptional()
    @IsString()
    cancelReason?: string;
}
