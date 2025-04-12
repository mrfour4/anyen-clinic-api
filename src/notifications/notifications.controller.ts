import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { NotificationsService } from './notifications.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly service: NotificationsService) {}

    @Get()
    @Roles('patient', 'doctor', 'admin')
    getMyNotifications(@Req() req) {
        return this.service.getMyNotifications(req.user);
    }

    @Patch(':id/read')
    @Roles('patient', 'doctor', 'admin')
    markAsRead(@Req() req, @Param('id') id: string) {
        return this.service.markAsRead(req.user, id);
    }

    @Patch('settings')
    @Roles('patient', 'doctor', 'admin')
    updateSettings(
        @Req() req,
        @Body() body: { type: string; enabled: boolean },
    ) {
        return this.service.updateNotificationSetting(
            req.user,
            body.type,
            body.enabled,
        );
    }

    @Get('settings')
    @Roles('patient', 'doctor', 'admin')
    getSettings(@Req() req) {
        return this.service.getNotificationSettings(req.user);
    }
}
