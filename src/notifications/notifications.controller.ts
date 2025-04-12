import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateNotificationSettingDto } from './dto/update-setting.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly service: NotificationsService) {}

    @Get()
    @Roles('patient', 'doctor', 'admin')
    @ApiOperation({ summary: 'Get my notifications' })
    @ApiResponse({ status: 200, description: 'List of notifications' })
    getMyNotifications(@Req() req) {
        return this.service.getMyNotifications(req.user);
    }

    @Patch(':id/read')
    @Roles('patient', 'doctor', 'admin')
    @ApiOperation({ summary: 'Mark a notification as read' })
    @ApiResponse({ status: 200, description: 'Notification marked as read' })
    markAsRead(@Req() req, @Param('id') id: string) {
        return this.service.markAsRead(req.user, id);
    }

    @Patch('settings')
    @Roles('patient', 'doctor', 'admin')
    @ApiOperation({ summary: 'Update notification setting' })
    @ApiBody({ type: UpdateNotificationSettingDto })
    @ApiResponse({
        status: 200,
        description: 'Notification setting updated',
    })
    updateSettings(@Req() req, @Body() dto: UpdateNotificationSettingDto) {
        return this.service.updateNotificationSetting(
            req.user,
            dto.type,
            dto.enabled,
        );
    }

    @Get('settings')
    @Roles('patient', 'doctor', 'admin')
    @ApiOperation({ summary: 'Get my notification settings' })
    @ApiResponse({ status: 200, description: 'List of notification settings' })
    getSettings(@Req() req) {
        return this.service.getNotificationSettings(req.user);
    }
}
