import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { successResponse } from 'src/utils/response.utils';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) {}

    async getMyNotifications(user: { userId: string }) {
        const notifications = await this.prisma.notification.findMany({
            where: {
                recipientId: user.userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return successResponse('Your notifications', notifications);
    }

    async markAsRead(user: { userId: string }, notificationId: string) {
        const notification = await this.prisma.notification.findUnique({
            where: { id: notificationId },
        });

        if (!notification || notification.recipientId !== user.userId) {
            throw new ForbiddenException(
                'You are not authorized to read this notification',
            );
        }

        const updated = await this.prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });

        return successResponse('Notification marked as read', updated);
    }

    async updateNotificationSetting(
        user: { userId: string },
        type: any,
        enabled: boolean,
    ) {
        const updated = await this.prisma.notificationSetting.upsert({
            where: {
                recipientId_notificationType: {
                    recipientId: user.userId,
                    notificationType: type,
                },
            },
            update: {
                isEnabled: enabled,
            },
            create: {
                recipientId: user.userId,
                notificationType: type,
                isEnabled: enabled,
            },
        });

        return successResponse('Notification setting updated', updated);
    }

    async getNotificationSettings(user: { userId: string }) {
        const settings = await this.prisma.notificationSetting.findMany({
            where: {
                recipientId: user.userId,
            },
        });

        return successResponse('Notification settings retrieved', settings);
    }
}
