import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AddPrescriptionDetailDto } from './dto/add-detail.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { PrescriptionsService } from './prescriptions.service';

@ApiTags('Prescriptions')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('prescriptions')
export class PrescriptionsController {
    constructor(private readonly service: PrescriptionsService) {}

    @Post()
    @Roles('doctor')
    @ApiOperation({ summary: 'Create a prescription for a given appointment' })
    @ApiBody({
        type: CreatePrescriptionDto,
        examples: {
            default: {
                summary: 'Create prescription',
                value: {
                    appointmentId: '4170bcb8-2979-4624-918f-7d9a7fab1bcc',
                },
            },
        },
    })
    create(@Req() req, @Body() dto: CreatePrescriptionDto) {
        return this.service.create(req.user.userId, dto);
    }

    @Post(':id/details')
    @Roles('doctor')
    @ApiOperation({ summary: 'Add medication detail to a prescription' })
    @ApiBody({
        type: AddPrescriptionDetailDto,
        examples: {
            default: {
                summary: 'Add detail',
                value: {
                    nameAmount: 'Paracetamol 500mg x 10 tablets',
                    dosage: 'Take 2 times a day after meals',
                },
            },
        },
    })
    addDetail(
        @Req() req,
        @Param('id') id: string,
        @Body() dto: AddPrescriptionDetailDto,
    ) {
        return this.service.addDetail(req.user.userId, id, dto);
    }

    @Get('my')
    @Roles('patient')
    @ApiOperation({ summary: 'Get prescriptions for current patient' })
    getMyPrescriptions(@Req() req) {
        return this.service.getPrescriptionsByPatient(req.user.userId);
    }

    @Get('my-created')
    @Roles('doctor')
    @ApiOperation({ summary: 'Get prescriptions created by doctor' })
    getMyCreated(@Req() req) {
        return this.service.getPrescriptionsByDoctor(req.user.userId);
    }

    @Get(':id')
    @Roles('doctor', 'patient')
    @ApiOperation({ summary: 'Get prescription by ID' })
    getById(@Req() req, @Param('id') id: string) {
        return this.service.getById(req.user, id);
    }
}
