import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
    constructor(private prisma: PrismaService) {}

    async createPaymentRequest(patientId: string, dto: CreatePaymentDto) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: dto.appointmentId },
        });

        if (!appointment || appointment.patientId !== patientId) {
            throw new ForbiddenException('Invalid appointment');
        }

        const existing = await this.prisma.payment.findFirst({
            where: { appointmentId: dto.appointmentId },
        });

        if (existing) {
            throw new BadRequestException('Payment request already exists');
        }

        const payment = await this.prisma.payment.create({
            data: {
                appointmentId: dto.appointmentId,
                doctorId: appointment.doctorId,
                patientId,
                totalPrice:
                    appointment.appointmentType === 'Online' ? 400000 : 500000,
                paymentMethod: dto.method,
                paymentStatus: 'pending',
            },
        });

        // TODO: redirect URL, signature sẽ xử lý sau
        return {
            message: 'Payment request created',
            data: payment,
        };
    }

    async getPaymentsByPatient(patientId: string) {
        const payments = await this.prisma.payment.findMany({
            where: { patientId },
            orderBy: { createdAt: 'desc' },
            include: {
                appointment: true,
                doctor: {
                    select: { name: true },
                },
            },
        });

        return {
            message: 'Your payment history',
            data: payments,
        };
    }

    async getPaymentsByDoctor(doctorId: string) {
        const payments = await this.prisma.payment.findMany({
            where: { doctorId },
            orderBy: { createdAt: 'desc' },
            include: {
                appointment: true,
                patient: {
                    select: { anonymousName: true },
                },
            },
        });

        return {
            message: 'Received payments',
            data: payments,
        };
    }
}
