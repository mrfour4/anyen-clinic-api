import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateEmotionDto } from './dto/create-emotion.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { PatientsService } from './patients.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('patient')
@Controller('patients')
export class PatientsController {
    constructor(private readonly patientsService: PatientsService) {}

    @Get('profile')
    getProfile(@Req() req) {
        return this.patientsService.getProfile(req.user.userId);
    }

    @Patch('profile')
    updateProfile(@Req() req, @Body() dto: UpdatePatientProfileDto) {
        return this.patientsService.updateProfile(req.user.userId, dto);
    }

    @Get('emotions')
    getEmotions(@Req() req) {
        return this.patientsService.getEmotions(req.user.userId);
    }

    @Post('emotions')
    createEmotion(@Req() req, @Body() dto: CreateEmotionDto) {
        return this.patientsService.createEmotion(req.user.userId, dto);
    }

    @Get('health-records')
    getHealthRecords(@Req() req) {
        return this.patientsService.getHealthRecords(req.user.userId);
    }

    @Post('health-records')
    createHealthRecord(@Req() req, @Body() body: any) {
        return this.patientsService.createHealthRecord(req.user.userId, body);
    }
}
