import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum MessageType {
    text = 'text',
    image = 'image',
}

export class SendMessageDto {
    @IsEnum(MessageType)
    messageType: MessageType;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsString()
    mediaUrl?: string;
}
