import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { successResponse } from 'src/utils/response.utils';

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

        return successResponse('List of doctors', mapped);
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

        if (!doctor) throw new NotFoundException('Doctor not found');

        return successResponse('Doctor profile', {
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
        });
    }
}
