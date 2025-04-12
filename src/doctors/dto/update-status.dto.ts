import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateDoctorStatusDto {
    @ApiProperty({ example: true, description: 'Online status of the doctor' })
    @IsBoolean()
    available: boolean;
}
