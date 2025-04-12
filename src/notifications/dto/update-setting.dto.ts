import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum } from 'class-validator';

export enum NotificationType {
    messages = 'messages',
    appointments = 'appointments',
    reviews = 'reviews',
    system = 'system',
}

export class UpdateNotificationSettingDto {
    @ApiProperty({
        enum: NotificationType,
        example: 'messages',
        description: 'Type of notification to update',
    })
    @IsEnum(NotificationType)
    type: NotificationType;

    @ApiProperty({
        example: true,
        description: 'Whether the notification type is enabled',
    })
    @IsBoolean()
    enabled: boolean;
}
