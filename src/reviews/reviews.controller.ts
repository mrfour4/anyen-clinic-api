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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('Reviews')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Post()
    @Roles('patient')
    @ApiOperation({ summary: 'Submit review after appointment' })
    @ApiBody({
        type: CreateReviewDto,
        examples: {
            example: {
                summary: 'Submit review',
                value: {
                    appointmentId: '4170bcb8-2979-4624-918f-7d9a7fab1bcc',
                    rating: 'Pleased',
                    comment: 'Doctor was very attentive and helpful',
                },
            },
        },
    })
    create(@Req() req, @Body() dto: CreateReviewDto) {
        return this.reviewsService.create(req.user.userId, dto);
    }

    @Get('doctor/:doctorId')
    @Roles('patient', 'doctor', 'admin')
    @ApiOperation({ summary: 'Get all non-violated reviews for a doctor' })
    getByDoctor(@Param('doctorId') doctorId: string) {
        return this.reviewsService.getByDoctor(doctorId);
    }

    @Patch(':id/moderate')
    @Roles('admin')
    @ApiOperation({ summary: 'Mark a review as violated or not (admin only)' })
    @ApiBody({
        type: ModerateReviewDto,
        examples: {
            flag: {
                summary: 'Flag review as violated',
                value: {
                    isViolated: true,
                },
            },
        },
    })
    moderate(@Param('id') id: string, @Body() dto: ModerateReviewDto) {
        return this.reviewsService.moderate(id, dto);
    }
}
