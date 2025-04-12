import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum MessageType {
    text = 'text',
    image = 'image',
}

export class SendMessageDto {
    @ApiProperty({
        enum: MessageType,
        example: MessageType.text,
        description: 'Type of the message: text or image',
    })
    @IsEnum(MessageType)
    messageType: MessageType;

    @ApiPropertyOptional({
        example: 'Hello doctor!',
        description: 'Text content of the message (for messageType = text)',
    })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiPropertyOptional({
        example:
            'https://your-supabase.storage.url/chat-media/appointment/...png',
        description: 'Public image URL (for messageType = image)',
    })
    @IsOptional()
    @IsString()
    mediaUrl?: string;
}
