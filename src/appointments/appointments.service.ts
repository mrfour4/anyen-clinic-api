import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { errorResponse, successResponse } from 'src/utils/response.utils';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
    constructor(private prisma: PrismaService) {}

    async create(patientId: string, dto: CreateAppointmentDto) {
        try {
            const appointment = await this.prisma.appointment.create({
                data: {
                    patientId,
                    doctorId: dto.doctorId,
                    appointmentTime: new Date(dto.appointmentTime),
                    appointmentType: dto.appointmentType,
                    question: dto.question,
                    status: 'Pending',
                },
            });

            return successResponse('Appointment created', appointment);
        } catch (error) {
            return errorResponse('Failed to create appointment');
        }
    }

    async findAll(user: { userId: string; role: string }) {
        let filter = {};
        if (user.role === 'patient') {
            filter = { patientId: user.userId };
        } else if (user.role === 'doctor') {
            filter = { doctorId: user.userId };
        }

        const appointments = await this.prisma.appointment.findMany({
            where: filter,
            orderBy: { appointmentTime: 'desc' },
            include: {
                patient: {
                    select: {
                        userId: true,
                        fullName: true,
                        anonymousName: true,
                    },
                },
                doctor: {
                    select: {
                        userId: true,
                        name: true,
                        specialization: true,
                    },
                },
            },
        });

        return successResponse('Appointments retrieved', appointments);
    }

    async update(
        user: { userId: string; role: string },
        appointmentId: string,
        dto: UpdateAppointmentDto,
    ) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
        });

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        const isOwner =
            (user.role === 'patient' &&
                appointment.patientId === user.userId) ||
            (user.role === 'doctor' && appointment.doctorId === user.userId) ||
            user.role === 'admin';

        if (!isOwner) {
            throw new ForbiddenException(
                'Not allowed to update this appointment',
            );
        }

        if (dto.status === 'Canceled' && !dto.cancelReason) {
            return errorResponse('Cancel reason is required');
        }

        if (dto.appointmentTime && user.role !== 'patient') {
            return errorResponse('Only patients can reschedule appointments');
        }

        const updated = await this.prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                status: dto.status,
                cancelReason: dto.cancelReason,
                appointmentTime: dto.appointmentTime
                    ? new Date(dto.appointmentTime)
                    : undefined,
            },
        });

        return successResponse('Appointment updated', updated);
    }
}
