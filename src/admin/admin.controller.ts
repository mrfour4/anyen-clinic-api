import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { StatisticsService } from 'src/statistics/statistics.service';
import { AdminService } from './admin.service';
import { VerifyDoctorDto } from './dto/verify-doctor.dto';

@ApiTags('Admin')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly statisticsService: StatisticsService,
    ) {}

    @Patch('verify-doctor/:id')
    verifyDoctor(@Param('id') id: string, @Body() dto: VerifyDoctorDto) {
        return this.adminService.verifyDoctor(id, dto);
    }

    @Get('unverified-doctors')
    getUnverifiedDoctors() {
        return this.adminService.getUnverifiedDoctors();
    }

    @Get('verified-doctors')
    getVerifiedDoctors() {
        return this.adminService.getVerifiedDoctors();
    }

    @Get('stats/appointments')
    async appointmentsStats() {
        return this.statisticsService.getAppointmentStats({});
    }

    @Get('stats/doctors')
    async doctorsStats() {
        return this.statisticsService.getDoctorStats();
    }

    @Get('stats/payments')
    async paymentsStats() {
        return this.statisticsService.getPaymentStats();
    }
}
