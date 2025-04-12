import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DoctorsService } from './doctors.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('doctors')
export class DoctorsController {
    constructor(private readonly service: DoctorsService) {}

    @Get()
    @Roles('patient', 'admin')
    getAllDoctors(@Req() req) {
        return this.service.getAllDoctors();
    }

    @Get(':id')
    @Roles('patient', 'admin')
    getDoctorById(@Param('id') id: string) {
        return this.service.getDoctorById(id);
    }
}
