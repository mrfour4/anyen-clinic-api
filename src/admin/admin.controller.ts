import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
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
    @ApiOperation({ summary: 'Verify a doctor by ID' })
    @ApiParam({ name: 'id', required: true })
    @ApiBody({ type: VerifyDoctorDto })
    @ApiResponse({ status: 200, description: 'Doctor verified' })
    verifyDoctor(@Param('id') id: string, @Body() dto: VerifyDoctorDto) {
        return this.adminService.verifyDoctor(id, dto);
    }

    @Get('unverified-doctors')
    @ApiOperation({ summary: 'Get list of unverified doctors' })
    @ApiResponse({ status: 200, description: 'List of unverified doctors' })
    getUnverifiedDoctors() {
        return this.adminService.getUnverifiedDoctors();
    }

    @Get('stats/appointments')
    @ApiOperation({ summary: 'Get appointment statistics' })
    appointmentsStats() {
        return this.statisticsService.getAppointmentStats({});
    }

    @Get('stats/doctors')
    @ApiOperation({ summary: 'Get doctor statistics' })
    doctorsStats() {
        return this.statisticsService.getDoctorStats();
    }

    @Get('stats/payments')
    @ApiOperation({ summary: 'Get payment statistics' })
    paymentsStats() {
        return this.statisticsService.getPaymentStats();
    }
}
