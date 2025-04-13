import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDoctorByAdminDto } from './dto/create-doctor.dto';
import { MarkReviewViolationDto } from './dto/mark-review-violation.dto';
import { UpdateAppointmentTypeDto } from './dto/update-appointment-type.dto';
import { VerifyDoctorDto } from './dto/verify-doctor.dto';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) {}

    async createDoctorByAdmin(dto: CreateDoctorByAdminDto) {
        const existing = await this.prisma.user.findUnique({
            where: { phoneNumber: dto.phone },
        });

        if (existing) {
            throw new BadRequestException('Phone number already registered');
        }

        const password = randomBytes(6).toString('hex'); // 12 ký tự
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                phoneNumber: dto.phone,
                passwordHash: hashedPassword,
                role: 'doctor',
                isVerified: true,
                doctor: {
                    create: {
                        name: dto.name,
                        specialization: dto.specialization,
                        workplace: dto.workplace,
                        experience: dto.experience,
                        workExperience: dto.workExperience,
                        educationHistory: dto.educationHistory,
                        medicalLicense: dto.medicalLicense,
                        available: true,
                    },
                },
            },
        });

        return {
            message: 'Doctor created and verified',
            data: {
                userId: user.id,
                phone: user.phoneNumber,
                password,
            },
        };
    }

    async getUnverifiedDoctors() {
        const doctors = await this.prisma.doctor.findMany({
            where: { isVerified: false },
            include: { user: true },
        });
        return { message: 'Unverified doctors', data: doctors };
    }

    async verifyDoctor(id: string, dto: VerifyDoctorDto) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { userId: id },
        });

        if (!doctor) throw new NotFoundException('Doctor not found');

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
