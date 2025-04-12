import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateEmotionDto } from './dto/create-emotion.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { PatientsService } from './patients.service';

@ApiTags('Patients')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('patient')
@Controller('patients')
export class PatientsController {
    constructor(private readonly patientsService: PatientsService) {}

    @Get('profile')
    @ApiOperation({ summary: 'Get current patient profile' })
    @ApiResponse({ status: 200, description: 'Patient profile retrieved' })
    getProfile(@Req() req) {
        return this.patientsService.getProfile(req.user.userId);
    }

    @Patch('profile')
    @ApiOperation({ summary: 'Update patient profile' })
    @ApiBody({
        type: UpdatePatientProfileDto,
        examples: {
            example: {
                summary: 'Update profile info',
                value: {
                    fullName: 'Nguyễn Văn A',
                    dateOfBirth: '1995-08-20',
                    gender: 'male',
                    anonymousName: 'Bệnh nhân A',
                    medicalHistory: 'Tiểu đường',
                    allergies: 'Phấn hoa',
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Profile updated successfully' })
    updateProfile(@Req() req, @Body() dto: UpdatePatientProfileDto) {
        return this.patientsService.updateProfile(req.user.userId, dto);
    }

    @Get('emotions')
    @ApiOperation({ summary: 'Get patient emotion history' })
    @ApiResponse({
        status: 200,
        description: 'List of emotion logs retrieved',
    })
    getEmotions(@Req() req) {
        return this.patientsService.getEmotions(req.user.userId);
    }

    @Post('emotions')
    @ApiOperation({ summary: 'Create new emotion log' })
    @ApiBody({
        type: CreateEmotionDto,
        examples: {
            happy: {
                summary: 'Log happy emotion',
                value: {
                    emotionStatus: 'happy',
                    description: 'Cảm thấy rất vui hôm nay!',
                },
            },
            stressful: {
                summary: 'Log stressful emotion',
                value: {
                    emotionStatus: 'stressful',
                    description: 'Căng thẳng do công việc',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Emotion log created successfully',
    })
    createEmotion(@Req() req, @Body() dto: CreateEmotionDto) {
        return this.patientsService.createEmotion(req.user.userId, dto);
    }

    @Get('health-records')
    @ApiOperation({ summary: 'Get patient health records' })
    @ApiResponse({
        status: 200,
        description: 'Health records retrieved',
    })
    getHealthRecords(@Req() req) {
        return this.patientsService.getHealthRecords(req.user.userId);
    }

    @Post('health-records')
    @ApiOperation({ summary: 'Create a new health record' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                recordDate: {
                    type: 'string',
                    format: 'date',
                    example: '2025-04-11',
                },
                heightCm: {
                    type: 'number',
                    example: 170,
                },
                weightKg: {
                    type: 'number',
                    example: 65,
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Health record created successfully',
    })
    createHealthRecord(@Req() req, @Body() body: any) {
        return this.patientsService.createHealthRecord(req.user.userId, body);
    }
}
