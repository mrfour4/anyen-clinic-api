import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class UpdateAppointmentTypeDto {
    @ApiProperty({
        example: 'Online',
        enum: ['Online', 'InPerson'],
        description: 'Type of appointment',
    })
    @IsIn(['Online', 'InPerson'])
    appointmentType: 'Online' | 'InPerson';
}
