import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/auth/types/auth-req';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { errorResponse, successResponse } from '../utils/response.utils';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('profile')
    async getProfile(@Req() req: AuthenticatedRequest) {
        const userId = req.user.userId;
        try {
            const user = await this.usersService.getUserProfile(userId);
            if (!user) {
                return errorResponse('User not found');
            }
            return successResponse('User profile fetched successfully', user);
        } catch (error) {
            return errorResponse(error.message);
        }
    }
}
