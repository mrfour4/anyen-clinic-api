import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
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
            throw new NotFoundException('Patient not found');
        }

        return {
            message: 'Patient profile retrieved',
            data: {
                ...patient,
                phoneNumber: patient.user.phoneNumber,
                avatarUrl: patient.user.avatarUrl,
                createdAt: patient.user.createdAt,
            },
        };
    }

    async updateProfile(userId: string, dto: UpdatePatientProfileDto) {
        const updated = await this.prisma.patient.update({
            where: { userId },
            data: dto,
        });

        return {
            message: 'Patient profile updated',
            data: updated,
        };
    }

    async getEmotions(userId: string) {
        const emotions = await this.prisma.emotionLog.findMany({
            where: { patientId: userId },
            orderBy: { createdAt: 'desc' },
        });

        return {
            message: 'Emotion logs retrieved',
            data: emotions,
        };
    }

    async createEmotion(userId: string, dto: CreateEmotionDto) {
        const emotion = await this.prisma.emotionLog.create({
            data: {
                patientId: userId,
                emotionStatus: dto.emotionStatus,
                description: dto.description,
            },
        });

        return {
            message: 'Emotion log created',
            data: emotion,
        };
    }

    async getHealthRecords(userId: string) {
        const records = await this.prisma.healthRecord.findMany({
            where: { patientId: userId },
            orderBy: { recordDate: 'desc' },
        });

        return {
            message: 'Health records retrieved',
            data: records,
        };
    }

    async createHealthRecord(userId: string, body: any) {
        const { recordDate, heightCm, weightKg } = body;

        if (!recordDate || !heightCm || !weightKg) {
            throw new BadRequestException('Missing required fields');
        }

        const height = parseFloat(heightCm);
        const weight = parseFloat(weightKg);

        if (height <= 0 || weight <= 0) {
            throw new BadRequestException('Invalid height or weight');
        }

        const record = await this.prisma.healthRecord.create({
            data: {
                patientId: userId,
                recordDate: new Date(recordDate),
                heightCm: height,
                weightKg: weight,
            },
        });

        return {
            message: 'Health record created',
            data: record,
        };
    }
}
