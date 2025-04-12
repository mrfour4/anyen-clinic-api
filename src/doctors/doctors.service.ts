import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DoctorsService {
    constructor(private prisma: PrismaService) {}

    async getAllDoctors() {
        const doctors = await this.prisma.doctor.findMany({
            where: {
                available: true,
            },
            orderBy: {
                name: 'asc',
            },
            select: {
                userId: true,
                name: true,
                specialization: true,
                experience: true,
                price: true,
                user: {
                    select: {
                        avatarUrl: true,
                    },
                },
            },
        });

        const mapped = doctors.map((doc) => ({
            id: doc.userId,
            name: doc.name,
            specialization: doc.specialization,
            experience: doc.experience,
            price: doc.price,
            avatarUrl: doc.user.avatarUrl,
        }));

        return {
            message: 'List of doctors',
            data: mapped,
        };
    }

    async getDoctorById(id: string) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { userId: id },
            select: {
                userId: true,
                name: true,
                gender: true,
                specialization: true,
                workplace: true,
                experience: true,
                workExperience: true,
                educationHistory: true,
                medicalLicense: true,
                price: true,
                available: true,
                user: {
                    select: {
                        avatarUrl: true,
                        phoneNumber: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!doctor) {
            throw new NotFoundException('Doctor not found');
        }

        return {
            message: 'Doctor profile',
            data: {
                id: doctor.userId,
                name: doctor.name,
                gender: doctor.gender,
                specialization: doctor.specialization,
                workplace: doctor.workplace,
                experience: doctor.experience,
                workExperience: doctor.workExperience,
                educationHistory: doctor.educationHistory,
                medicalLicense: doctor.medicalLicense,
                price: doctor.price,
                available: doctor.available,
                avatarUrl: doctor.user.avatarUrl,
                phoneNumber: doctor.user.phoneNumber,
                createdAt: doctor.user.createdAt,
            },
        };
    }

    async getVerifiedDoctors() {
        const doctors = await this.prisma.doctor.findMany({
            where: { isVerified: true },
            orderBy: { name: 'asc' },
            include: {
                user: { select: { avatarUrl: true } },
            },
        });

        return {
            message: 'Verified doctors retrieved',
            data: doctors.map((doc) => ({
                id: doc.userId,
                name: doc.name,
                specialization: doc.specialization,
                experience: doc.experience,
                avatarUrl: doc.user.avatarUrl,
            })),
        };
    }

    async updateStatus(
        doctorId: string,
        available: boolean,
        user: { userId: string; role: string },
    ) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { userId: doctorId },
        });

        if (!doctor) {
            throw new NotFoundException('Doctor not found');
        }

        const isOwner = user.userId === doctorId;
        const isAdmin = user.role === 'admin';

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException('Not authorized to update status');
        }

        const updated = await this.prisma.doctor.update({
            where: { userId: doctorId },
            data: { available },
        });

        return {
            message: 'Doctor status updated',
            data: updated,
        };
    }
}
