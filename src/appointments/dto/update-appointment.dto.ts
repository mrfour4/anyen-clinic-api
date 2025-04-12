import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export enum AppointmentStatus {
    Pending = 'Pending',
    Confirmed = 'Confirmed',
    Completed = 'Completed',
    Canceled = 'Canceled',
}

export class UpdateAppointmentDto {
    @ApiPropertyOptional({
        example: '2025-04-13T15:00:00.000Z',
        description: 'New appointment time (only patient can reschedule)',
    })
    @IsOptional()
    @IsDateString()
    appointmentTime?: string;

    @ApiPropertyOptional({
        enum: AppointmentStatus,
        example: AppointmentStatus.Canceled,
        description: 'Status to update: Confirmed, Completed, or Canceled',
    })
    @IsOptional()
    @IsEnum(AppointmentStatus)
    status?: AppointmentStatus;

    @ApiPropertyOptional({
        example: 'Doctor is unavailable at this time',
        description: 'Required if status is Canceled',
    })
    @IsOptional()
    @IsString()
    cancelReason?: string;
}
