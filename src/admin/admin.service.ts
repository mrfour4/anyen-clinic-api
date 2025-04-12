import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MarkReviewViolationDto } from './dto/mark-review-violation.dto';
import { UpdateAppointmentTypeDto } from './dto/update-appointment-type.dto';
import { VerifyDoctorDto } from './dto/verify-doctor.dto';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) {}

    async getUnverifiedDoctors() {
        const doctors = await this.prisma.doctor.findMany({
            where: { isVerified: false },
            include: { user: true },
        });
        return { message: 'Unverified doctors', data: doctors };
    }

    async getVerifiedDoctors() {
        const doctors = await this.prisma.doctor.findMany({
            where: { isVerified: true },
            include: { user: true },
        });
        return { message: 'Verified doctors', data: doctors };
    }

    async verifyDoctor(id: string, dto: VerifyDoctorDto) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { userId: id },
        });
        if (!doctor) throw new NotFoundException('Doctor not found');
        if (doctor.isVerified)
            throw new BadRequestException('Doctor already verified');

        const updated = await this.prisma.doctor.update({
            where: { userId: id },
            data: {
                ...dto,
                isVerified: true,
            },
        });

        return { message: 'Doctor verified', data: updated };
    }

    async updateAppointmentType(id: string, dto: UpdateAppointmentTypeDto) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id },
        });
        if (!appointment) throw new NotFoundException('Appointment not found');

        const updated = await this.prisma.appointment.update({
            where: { id },
            data: { appointmentType: dto.appointmentType },
        });

        return { message: 'Appointment type updated', data: updated };
    }

    async getPendingReviews() {
        const reviews = await this.prisma.review.findMany({
            where: { isViolated: false },
            include: {
                patient: { select: { anonymousName: true } },
                doctor: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return { message: 'Pending reviews', data: reviews };
    }

    async markReviewViolation(id: string, dto: MarkReviewViolationDto) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review) throw new NotFoundException('Review not found');

        const updated = await this.prisma.review.update({
            where: { id },
            data: { isViolated: dto.isViolated },
        });

        return { message: 'Review violation updated', data: updated };
    }

    async getAppointmentsByStatus(status?: any) {
        const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Canceled'];
        if (status && !validStatuses.includes(status)) {
            throw new BadRequestException('Invalid status');
        }

        const appointments = await this.prisma.appointment.findMany({
            where: status ? { status } : {},
            include: {
                patient: { select: { anonymousName: true } },
                doctor: { select: { name: true } },
            },
            orderBy: { appointmentTime: 'desc' },
        });

        return {
            message: 'Appointments retrieved',
            data: appointments,
        };
    }
}
