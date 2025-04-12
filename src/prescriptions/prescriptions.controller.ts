import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AddPrescriptionDetailDto } from './dto/add-detail.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { PrescriptionsService } from './prescriptions.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('prescriptions')
export class PrescriptionsController {
    constructor(private readonly service: PrescriptionsService) {}

    @Post()
    @Roles('doctor')
    create(@Req() req, @Body() dto: CreatePrescriptionDto) {
        return this.service.create(req.user.userId, dto);
    }

    @Post(':id/details')
    @Roles('doctor')
    addDetail(
        @Req() req,
        @Param('id') id: string,
        @Body() dto: AddPrescriptionDetailDto,
    ) {
        return this.service.addDetail(req.user.userId, id, dto);
    }

    @Get('my')
    @Roles('patient')
    getMyPrescriptions(@Req() req) {
        return this.service.getPrescriptionsByPatient(req.user.userId);
    }

    @Get('my-created')
    @Roles('doctor')
    getMyCreated(@Req() req) {
        return this.service.getPrescriptionsByDoctor(req.user.userId);
    }

    @Get(':id')
    @Roles('doctor', 'patient')
    getById(@Req() req, @Param('id') id: string) {
        return this.service.getById(req.user, id);
    }
}
