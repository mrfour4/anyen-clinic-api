import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { errorResponse, successResponse } from 'src/utils/response.utils';
import { CreateEmotionDto } from './dto/create-emotion.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';

@Injectable()
export class PatientsService {
    constructor(private prisma: PrismaService) {}

    async getProfile(userId: string) {
        const patient = await this.prisma.patient.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        phoneNumber: true,
                        avatarUrl: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!patient) {
            return errorResponse('Patient not found');
        }

        return successResponse('Patient profile retrieved', {
            ...patient,
            phoneNumber: patient.user.phoneNumber,
            avatarUrl: patient.user.avatarUrl,
            createdAt: patient.user.createdAt,
        });
    }

    async updateProfile(userId: string, dto: UpdatePatientProfileDto) {
        try {
            const updated = await this.prisma.patient.update({
                where: { userId },
                data: dto,
            });
            return successResponse('Patient profile updated', updated);
        } catch (error) {
            return errorResponse('Failed to update patient profile');
        }
    }

    async getEmotions(userId: string) {
        const emotions = await this.prisma.emotionLog.findMany({
            where: { patientId: userId },
            orderBy: { createdAt: 'desc' },
        });

        return successResponse('Emotion logs retrieved', emotions);
    }

    async createEmotion(userId: string, dto: CreateEmotionDto) {
        try {
            const emotion = await this.prisma.emotionLog.create({
                data: {
                    patientId: userId,
                    emotionStatus: dto.emotionStatus,
                    description: dto.description,
                },
            });
            return successResponse('Emotion log created', emotion);
        } catch (error) {
            return errorResponse('Failed to create emotion log');
        }
    }

    async getHealthRecords(userId: string) {
        const records = await this.prisma.healthRecord.findMany({
            where: { patientId: userId },
            orderBy: { recordDate: 'desc' },
        });

        return successResponse('Health records retrieved', records);
    }

    async createHealthRecord(userId: string, body: any) {
        const { recordDate, heightCm, weightKg } = body;

        if (!recordDate || !heightCm || !weightKg) {
            return errorResponse('Missing required fields');
        }

        const height = parseFloat(heightCm);
        const weight = parseFloat(weightKg);

        if (height <= 0 || weight <= 0) {
            return errorResponse('Invalid height or weight');
        }

        try {
            const record = await this.prisma.healthRecord.create({
                data: {
                    patientId: userId,
                    recordDate: new Date(recordDate),
                    heightCm: height,
                    weightKg: weight,
                },
            });
            return successResponse('Health record created', record);
        } catch (error) {
            return errorResponse('Failed to create health record');
        }
    }
}
