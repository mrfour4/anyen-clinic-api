import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DoctorsService } from './doctors.service';
import { UpdateDoctorStatusDto } from './dto/update-status.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('doctors')
export class DoctorsController {
    constructor(private readonly service: DoctorsService) {}

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('doctor', 'admin')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Update doctor availability (online/offline)' })
    async updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateDoctorStatusDto,
        @Req() req: any,
    ) {
        return this.service.updateStatus(id, dto.available, req.user);
    }

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
