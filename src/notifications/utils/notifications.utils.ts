import { PrismaService } from 'src/prisma/prisma.service';

export async function sendNotification(
    prisma: PrismaService,
    recipientId: string,
    type: 'appointments' | 'messages' | 'payments' | 'reviews',
    content: string,
) {
    const setting = await prisma.notificationSetting.findUnique({
        where: {
            recipientId_notificationType: {
                recipientId,
                notificationType: type,
            },
        },
    });

    if (setting && !setting.isEnabled) return;

    await prisma.notification.create({
        data: {
            recipientId,
            notificationType: type,
            content,
        },
    });
}
