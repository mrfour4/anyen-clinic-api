import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { sendNotification } from 'src/notifications/utils/notifications.utils';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatsService {
    constructor(
        private prisma: PrismaService,
        private supabaseService: SupabaseService,
    ) {}

    async sendMessage(user: any, appointmentId: string, dto: SendMessageDto) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                patient: true,
                doctor: true,
                payments: true,
            },
        });

        if (!appointment) throw new NotFoundException('Appointment not found');

        const isPatient = appointment.patientId === user.userId;
        const isDoctor = appointment.doctorId === user.userId;
        const isParticipant = isPatient || isDoctor;

        if (!isParticipant) {
            throw new ForbiddenException('You are not in this appointment');
        }

        const paid = appointment.payments.some(
            (p) => p.paymentStatus === 'paid',
        );

        if (!paid) {
            throw new ForbiddenException('Payment not completed');
        }

        if (appointment.status === 'Completed') {
            throw new ForbiddenException(
                'Appointment ended. You can only read messages.',
            );
        }

        const message = await this.prisma.message.create({
            data: {
                appointmentId: appointment.id,
                senderId: user.userId,
                receiverId: isPatient
                    ? appointment.doctorId
                    : appointment.patientId,
                messageType: dto.messageType,
                content: dto.content,
                mediaUrl: dto.mediaUrl,
            },
        });

        const receiverId = isPatient
            ? appointment.doctorId
            : appointment.patientId;

        await sendNotification(
            this.prisma,
            receiverId,
            'messages',
            'You have a new message in the appointment',
        );

        return {
            message: 'Message sent',
            data: message,
        };
    }

    async uploadImage(
        user: any,
        appointmentId: string,
        file: Express.Multer.File,
    ) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                payments: true,
            },
        });

        if (!appointment) throw new NotFoundException('Appointment not found');

        const isPatient = appointment.patientId === user.userId;
        const isDoctor = appointment.doctorId === user.userId;

        if (!isPatient && !isDoctor) {
            throw new ForbiddenException('You are not in this appointment');
        }

        const paid = appointment.payments.some(
            (p) => p.paymentStatus === 'paid',
        );
        if (!paid) throw new ForbiddenException('Payment not completed');

        if (appointment.status === 'Completed') {
            throw new ForbiddenException(
                'Appointment ended. You can only view messages.',
            );
        }

        if (!file.mimetype.startsWith('image/')) {
            throw new ForbiddenException('Only image files are allowed');
        }

        const filename = `appointment/${appointmentId}/${Date.now()}-${file.originalname}`;

        const publicUrl = await this.supabaseService.uploadToStorage(
            file.buffer,
            filename,
            file.mimetype,
        );

        return {
            message: 'Image uploaded successfully',
            data: { mediaUrl: publicUrl },
        };
    }

    async getMessages(user: any, appointmentId: string) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
        });

        if (!appointment) throw new NotFoundException('Appointment not found');

        if (
            appointment.patientId !== user.userId &&
            appointment.doctorId !== user.userId
        ) {
            throw new ForbiddenException('Not allowed');
        }

        const messages = await this.prisma.message.findMany({
            where: { appointmentId },
            orderBy: { createdAt: 'asc' },
        });

        return {
            message: 'Messages retrieved',
            data: messages,
        };
    }
}
