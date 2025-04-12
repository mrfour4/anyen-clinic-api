import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatsFilterDto } from './dto/stats-filter.dto';

@Injectable()
export class StatisticsService {
    constructor(private prisma: PrismaService) {}

    async getAppointmentStats(filter: StatsFilterDto) {
        const where: any = {};

        if (filter.status) where.status = filter.status;
        if (filter.fromDate || filter.toDate) {
            where.appointmentTime = {};
            if (filter.fromDate) {
                where.appointmentTime.gte = new Date(filter.fromDate);
            }
            if (filter.toDate) {
                where.appointmentTime.lte = new Date(filter.toDate);
            }
        }

        const total = await this.prisma.appointment.count({ where });
        return {
            message: 'Appointment statistics',
            data: {
                total,
            },
        };
    }

    async getDoctorStats() {
        const total = await this.prisma.doctor.count({
            where: { isVerified: true },
        });
        const online = await this.prisma.doctor.count({
            where: { available: true, isVerified: true },
        });

        return {
            message: 'Doctor statistics',
            data: {
                total,
                online,
                offline: total - online,
            },
        };
    }

    async getPaymentStats() {
        const result = await this.prisma.payment.aggregate({
            where: { paymentStatus: 'paid' },
            _sum: { totalPrice: true },
            _count: true,
        });

        return {
            message: 'Payment statistics',
            data: {
                totalRevenue: result._sum.totalPrice || 0,
                totalPayments: result._count,
            },
        };
    }
}
