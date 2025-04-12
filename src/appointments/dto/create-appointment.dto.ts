import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum AppointmentType {
    InPerson = 'InPerson',
    Online = 'Online',
}

export class CreateAppointmentDto {
    @ApiProperty({
        example: '2025-04-11T14:30:00.000Z',
        description: 'Time of the appointment in ISO 8601 format',
    })
    @IsNotEmpty()
    @IsDateString()
    appointmentTime: string;

    @ApiProperty({
        example: '4933c14f-5ee6-49c5-a559-11034a426a53',
        description: 'Doctor ID to book an appointment with',
    })
    @IsNotEmpty()
    @IsString()
    doctorId: string;

    @ApiProperty({
        example: 'Tôi cảm thấy lo lắng quá mức...',
        description: 'Main question or reason for consultation',
    })
    @IsNotEmpty()
    @IsString()
    question: string;

    @ApiProperty({
        enum: AppointmentType,
        example: AppointmentType.Online,
        description: 'Type of appointment: InPerson or Online',
    })
    @IsNotEmpty()
    @IsEnum(AppointmentType)
    appointmentType: AppointmentType;
}
