import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class VerifyDoctorDto {
    @ApiProperty({ example: 'Nguyễn Văn A' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Tâm lý học' })
    @IsString()
    @IsNotEmpty()
    specialization: string;

    @ApiProperty({ example: 'Bệnh viện Tâm thần TW' })
    @IsString()
    @IsNotEmpty()
    workplace: string;

    @ApiProperty({ example: 5 })
    @IsNumber()
    @Min(0)
    experience: number;

    @ApiProperty({ example: '5 năm làm việc tại BV Tâm thần TP.HCM' })
    @IsString()
    workExperience: string;

    @ApiProperty({ example: 'ĐH Y Hà Nội, lớp Chuyên khoa I' })
    @IsString()
    educationHistory: string;

    @ApiProperty({ example: 'B123456/2022/BYT' })
    @IsString()
    medicalLicense: string;
}
