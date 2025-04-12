import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthenticatedRequest } from 'src/auth/types/auth-req';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) {}

    @Post()
    @Roles('patient')
    create(
        @Req() req: AuthenticatedRequest,
        @Body() dto: CreateAppointmentDto,
    ) {
        return this.appointmentsService.create(req.user.userId, dto);
    }

    @Get()
    @Roles('patient', 'doctor', 'admin')
    findAll(@Req() req: AuthenticatedRequest) {
        return this.appointmentsService.findAll(req.user);
    }

    @Patch(':id')
    @Roles('patient', 'doctor', 'admin')
    update(
        @Req() req: AuthenticatedRequest,
        @Param('id') id: string,
        @Body() dto: UpdateAppointmentDto,
    ) {
        return this.appointmentsService.update(req.user, id, dto);
    }
}
