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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthenticatedRequest } from 'src/auth/types/auth-req';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@ApiTags('Appointments')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) {}

    @Post()
    @Roles('patient')
    @ApiOperation({
        summary: 'Create a new appointment',
        description: 'Patients can schedule appointments with doctors',
    })
    @ApiBody({
        type: CreateAppointmentDto,
        examples: {
            example: {
                summary: 'Create appointment example',
                value: {
                    doctorId: '4933c14f-5ee6-49c5-a559-11034a426a53',
                    appointmentTime: '2025-04-11T14:30:00.000Z',
                    question: 'Tôi cảm thấy lo lắng quá mức...',
                    appointmentType: 'Online',
                },
            },
        },
    })
    create(
        @Req() req: AuthenticatedRequest,
        @Body() dto: CreateAppointmentDto,
    ) {
        return this.appointmentsService.create(req.user.userId, dto);
    }

    @Get()
    @Roles('patient', 'doctor', 'admin')
    @ApiOperation({
        summary: 'Get appointments by role',
        description: 'Patients/Doctors/Admins can retrieve their appointments',
    })
    findAll(@Req() req: AuthenticatedRequest) {
        return this.appointmentsService.findAll(req.user);
    }

    @Patch(':id')
    @Roles('patient', 'doctor', 'admin')
    @ApiOperation({
        summary: 'Update appointment',
        description:
            'Patient can reschedule; Doctor/Admin can update status or cancel',
    })
    @ApiBody({
        type: UpdateAppointmentDto,
        examples: {
            updateStatus: {
                summary: 'Update appointment status to Confirmed',
                value: {
                    status: 'Confirmed',
                },
            },
            cancelWithReason: {
                summary: 'Cancel appointment with reason',
                value: {
                    status: 'Canceled',
                    cancelReason: 'Doctor is unavailable at that time',
                },
            },
            reschedule: {
                summary: 'Patient reschedules appointment',
                value: {
                    appointmentTime: '2025-04-13T15:00:00.000Z',
                },
            },
        },
    })
    update(
        @Req() req: AuthenticatedRequest,
        @Param('id') id: string,
        @Body() dto: UpdateAppointmentDto,
    ) {
        return this.appointmentsService.update(req.user, id, dto);
    }
}
