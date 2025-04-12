import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminService } from './admin.service';
import { VerifyDoctorDto } from './dto/verify-doctor.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('unverified-doctors')
    getUnverifiedDoctors() {
        return this.adminService.getUnverifiedDoctors();
    }

    @Get('verified-doctors')
    getVerifiedDoctors() {
        return this.adminService.getVerifiedDoctors();
    }

    @Patch('verify-doctor/:id')
    verifyDoctor(@Param('id') id: string, @Body() dto: VerifyDoctorDto) {
        return this.adminService.verifyDoctor(id, dto);
    }
}
