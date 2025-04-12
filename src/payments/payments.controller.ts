import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
    constructor(private readonly service: PaymentsService) {}

    @Post()
    @Roles('patient')
    create(@Req() req, @Body() dto: CreatePaymentDto) {
        return this.service.createPaymentRequest(req.user.userId, dto);
    }

    @Get('my')
    @Roles('patient')
    getMyPayments(@Req() req) {
        return this.service.getPaymentsByPatient(req.user.userId);
    }

    @Get('received')
    @Roles('doctor')
    getPaymentsByDoctor(@Req() req) {
        return this.service.getPaymentsByDoctor(req.user.userId);
    }
}
