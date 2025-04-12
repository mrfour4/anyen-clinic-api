import { IsIn } from 'class-validator';

export class UpdateAppointmentTypeDto {
    @IsIn(['Online', 'InPerson'])
    appointmentType: 'Online' | 'InPerson';
}
