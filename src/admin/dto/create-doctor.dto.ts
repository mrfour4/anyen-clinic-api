import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPhoneNumber, IsString, Min } from 'class-validator';

export class CreateDoctorByAdminDto {
    @ApiProperty({ example: '0384623506' })
    @IsPhoneNumber('VN')
    phone: string;

    @ApiProperty({ example: 'Nguyễn Văn A' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Tâm lý học lâm sàng' })
    @IsString()
    specialization: string;

    @ApiProperty({ example: 'Bệnh viện XYZ' })
    @IsString()
    workplace: string;

    @ApiProperty({ example: 5 })
    @IsNumber()
    @Min(0)
    experience: number;

    @ApiProperty({ example: '5 năm tại BV Tâm Thần Trung Ương' })
    @IsString()
    workExperience: string;

    @ApiProperty({ example: 'Đại học Y Dược TPHCM' })
    @IsString()
    educationHistory: string;

    @ApiProperty({ example: 'ML-123456' })
    @IsString()
    medicalLicense: string;
}
