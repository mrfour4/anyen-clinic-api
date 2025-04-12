import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Req,
    UseGuards,
} from '@nestjs/common';
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
import { DoctorsService } from './doctors.service';
import { UpdateDoctorStatusDto } from './dto/update-status.dto';

@ApiTags('Doctors')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('doctors')
export class DoctorsController {
    constructor(private readonly service: DoctorsService) {}

    @Patch(':id/status')
    @Roles('doctor', 'admin')
    @ApiOperation({ summary: 'Update doctor availability (online/offline)' })
    @ApiParam({
        name: 'id',
        description: 'Doctor ID to update status',
        example: '4933c14f-5ee6-49c5-a559-11034a426a53',
    })
    @ApiBody({
        type: UpdateDoctorStatusDto,
        examples: {
            example: {
                summary: 'Set doctor online',
                value: { available: true },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Doctor status updated successfully',
    })
    async updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateDoctorStatusDto,
        @Req() req: any,
    ) {
        return this.service.updateStatus(id, dto.available, req.user);
    }

    @Get('verified-doctors')
    @Roles('patient', 'admin')
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Get list of verified doctors (for patient & admin)',
    })
    @ApiResponse({ status: 200, description: 'List of verified doctors' })
    getVerifiedDoctors() {
        return this.service.getVerifiedDoctors();
    }

    @Get()
    @Roles('admin')
    @ApiOperation({ summary: 'Get all verified and available doctors' })
    @ApiResponse({
        status: 200,
        description: 'List of doctors retrieved',
    })
    getAllDoctors(@Req() req) {
        return this.service.getAllDoctors();
    }

    @Get(':id')
    @Roles('patient', 'admin')
    @ApiOperation({ summary: 'Get full doctor profile by ID' })
    @ApiParam({
        name: 'id',
        description: 'Doctor ID to fetch details',
        example: '4933c14f-5ee6-49c5-a559-11034a426a53',
    })
    @ApiResponse({
        status: 200,
        description: 'Doctor profile retrieved',
    })
    getDoctorById(@Param('id') id: string) {
        return this.service.getDoctorById(id);
    }
}
