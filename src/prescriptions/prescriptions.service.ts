import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddPrescriptionDetailDto } from './dto/add-detail.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

@Injectable()
export class PrescriptionsService {
    constructor(private prisma: PrismaService) {}

    async create(doctorId: string, dto: CreatePrescriptionDto) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: dto.appointmentId },
        });

        if (!appointment || appointment.doctorId !== doctorId) {
            throw new ForbiddenException(
                'You are not the doctor for this appointment',
            );
        }

        const prescription = await this.prisma.prescription.create({
            data: {
                appointmentId: dto.appointmentId,
                doctorId,
                patientId: appointment.patientId,
            },
        });

        return {
            message: 'Prescription created',
            data: prescription,
        };
    }

    async addDetail(
        doctorId: string,
        prescriptionId: string,
        dto: AddPrescriptionDetailDto,
    ) {
        const prescription = await this.prisma.prescription.findUnique({
            where: { id: prescriptionId },
        });

        if (!prescription || prescription.doctorId !== doctorId) {
            throw new ForbiddenException('You cannot modify this prescription');
        }

        const detail = await this.prisma.prescriptionDetail.create({
            data: {
                prescriptionId,
                nameAmount: dto.nameAmount,
                dosage: dto.dosage,
            },
        });

        return {
            message: 'Detail added',
            data: detail,
        };
    }

    async getPrescriptionsByPatient(patientId: string) {
        const prescriptions = await this.prisma.prescription.findMany({
            where: { patientId },
            include: { details: true, appointment: true },
            orderBy: { createdAt: 'desc' },
        });

        return {
            message: 'Prescriptions retrieved',
            data: prescriptions,
        };
    }

    async getPrescriptionsByDoctor(doctorId: string) {
        const prescriptions = await this.prisma.prescription.findMany({
            where: { doctorId },
            include: { details: true, appointment: true },
            orderBy: { createdAt: 'desc' },
        });

        return {
            message: 'Prescriptions retrieved',
            data: prescriptions,
        };
    }

    async getById(user: any, prescriptionId: string) {
        const prescription = await this.prisma.prescription.findUnique({
            where: { id: prescriptionId },
            include: { details: true, appointment: true },
        });

        if (!prescription) {
            throw new NotFoundException('Prescription not found');
        }

        const isOwner =
            (user.role === 'doctor' && prescription.doctorId === user.userId) ||
            (user.role === 'patient' && prescription.patientId === user.userId);

        if (!isOwner) {
            throw new ForbiddenException('Not your prescription');
        }

        return {
            message: 'Prescription details',
            data: prescription,
        };
    }
}
