import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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

        return {
            message: 'Your notifications',
            data: notifications,
        };
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

        return {
            message: 'Notification marked as read',
            data: updated,
        };
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

        return {
            message: 'Notification setting updated',
            data: updated,
        };
    }

    async getNotificationSettings(user: { userId: string }) {
        const settings = await this.prisma.notificationSetting.findMany({
            where: {
                recipientId: user.userId,
            },
        });

        return {
            message: 'Notification settings retrieved',
            data: settings,
        };
    }
}
