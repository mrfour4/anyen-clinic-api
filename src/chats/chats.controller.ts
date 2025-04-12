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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ChatsService } from './chats.service';
import { SendMessageDto } from './dto/send-message.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('chats')
export class ChatsController {
    constructor(private readonly chatsService: ChatsService) {}

    @Post(':appointmentId/messages')
    @Roles('patient', 'doctor')
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
    async uploadImage(
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
        @Param('appointmentId') appointmentId: string,
    ) {
        return this.chatsService.uploadImage(req.user, appointmentId, file);
    }

    @Get(':appointmentId/messages')
    @Roles('patient', 'doctor')
    getMessages(@Req() req, @Param('appointmentId') appointmentId: string) {
        return this.chatsService.getMessages(req.user, appointmentId);
    }
}
