import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) {}

    async create(patientId: string, dto: CreateReviewDto) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: dto.appointmentId },
        });

        if (!appointment || appointment.patientId !== patientId) {
            throw new BadRequestException('Invalid appointment');
        }

        if (appointment.status !== 'Completed') {
            throw new BadRequestException(
                'You can only review after appointment is completed',
            );
        }

        const existing = await this.prisma.review.findFirst({
            where: {
                appointmentId: dto.appointmentId,
                patientId,
            },
        });

        if (existing) {
            throw new BadRequestException(
                'You already reviewed this appointment',
            );
        }

        const review = await this.prisma.review.create({
            data: {
                appointmentId: dto.appointmentId,
                patientId,
                doctorId: appointment.doctorId,
                rating: dto.rating,
                comment: dto.comment,
            },
        });

        await this.prisma.appointment.update({
            where: { id: dto.appointmentId },
            data: { isReviewed: true },
        });

        return {
            message: 'Review submitted',
            data: review,
        };
    }

    async getByDoctor(doctorId: string) {
        const reviews = await this.prisma.review.findMany({
            where: {
                doctorId,
                isViolated: false,
            },
            orderBy: { createdAt: 'desc' },
            include: {
                patient: {
                    select: {
                        anonymousName: true,
                    },
                },
            },
        });

        return {
            message: 'Reviews for doctor',
            data: reviews,
        };
    }

    async moderate(reviewId: string, dto: ModerateReviewDto) {
        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        const updated = await this.prisma.review.update({
            where: { id: reviewId },
            data: { isViolated: dto.isViolated },
        });

        return {
            message: 'Review moderation updated',
            data: updated,
        };
    }
}
