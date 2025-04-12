import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';
import { ReviewsService } from './reviews.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Post()
    @Roles('patient')
    create(@Req() req, @Body() dto: CreateReviewDto) {
        return this.reviewsService.create(req.user.userId, dto);
    }

    @Get('doctor/:doctorId')
    @Roles('patient', 'doctor', 'admin')
    getByDoctor(@Param('doctorId') doctorId: string) {
        return this.reviewsService.getByDoctor(doctorId);
    }

    @Patch(':id/moderate')
    @Roles('admin')
    moderate(@Param('id') id: string, @Body() dto: ModerateReviewDto) {
        return this.reviewsService.moderate(id, dto);
    }
}
