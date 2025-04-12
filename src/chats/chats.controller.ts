import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ChatsService } from './chats.service';
import { SendMessageDto } from './dto/send-message.dto';

@ApiTags('Chats')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('chats')
export class ChatsController {
    constructor(private readonly chatsService: ChatsService) {}

    @Post(':appointmentId/messages')
    @Roles('patient', 'doctor')
    @ApiOperation({
        summary: 'Send a chat message',
        description:
            'Send a text or image message within a paid and active appointment session.',
    })
    @ApiParam({
        name: 'appointmentId',
        description: 'The ID of the appointment',
    })
    @ApiBody({
        type: SendMessageDto,
        examples: {
            textMessage: {
                summary: 'Send text message',
                value: {
                    messageType: 'text',
                    content: 'Xin chào bác sĩ!',
                },
            },
            imageMessage: {
                summary: 'Send image message',
                value: {
                    messageType: 'image',
                    mediaUrl:
                        'https://nhrgtqufmbnvrjrhysds.supabase.co/storage/v1/object/public/chat-media/appointment/...png',
                },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Message sent successfully' })
    sendMessage(
        @Req() req,
        @Param('appointmentId') appointmentId: string,
        @Body() dto: SendMessageDto,
    ) {
        return this.chatsService.sendMessage(req.user, appointmentId, dto);
    }

    @Post(':appointmentId/upload-image')
    @Roles('patient', 'doctor')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({
        summary: 'Upload image to Supabase storage',
        description:
            'Uploads an image to Supabase and returns a public media URL. Use the returned URL to send an image message.',
    })
    @ApiParam({ name: 'appointmentId', description: 'ID of the appointment' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Image uploaded successfully and returns mediaUrl',
    })
    async uploadImage(
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
        @Param('appointmentId') appointmentId: string,
    ) {
        return this.chatsService.uploadImage(req.user, appointmentId, file);
    }

    @Get(':appointmentId/messages')
    @Roles('patient', 'doctor')
    @ApiOperation({
        summary: 'Get messages for an appointment',
        description: 'Returns all messages sorted by time for the session',
    })
    @ApiParam({ name: 'appointmentId', description: 'ID of the appointment' })
    @ApiResponse({
        status: 200,
        description: 'List of messages in the appointment',
    })
    getMessages(@Req() req, @Param('appointmentId') appointmentId: string) {
        return this.chatsService.getMessages(req.user, appointmentId);
    }
}
