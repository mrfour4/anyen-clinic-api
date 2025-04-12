import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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
import { AuthenticatedRequest } from 'src/auth/types/auth-req';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post()
    @Roles('patient')
    @ApiOperation({
        summary: 'Create payment request',
        description:
            'Simulate payment creation using a chosen method (vnpay, zalopay, momopay). ' +
            'Payment is marked as paid immediately (real integration pending).',
    })
    @ApiBody({
        type: CreatePaymentDto,
        examples: {
            default: {
                summary: 'Simulated VNPAY payment',
                value: {
                    appointmentId: '4170bcb8-2979-4624-918f-7d9a7fab1bcc',
                    method: 'vnpay',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Payment request created and marked as paid',
    })
    createPayment(
        @Req() req: AuthenticatedRequest,
        @Body() dto: CreatePaymentDto,
    ) {
        return this.paymentsService.createPaymentRequest(req.user.userId, dto);
    }

    @Get('my')
    @Roles('patient')
    @ApiOperation({ summary: 'Get my payment history' })
    getMyPayments(@Req() req: AuthenticatedRequest) {
        return this.paymentsService.getPaymentsByPatient(req.user.userId);
    }

    @Get('received')
    @Roles('doctor')
    @ApiOperation({ summary: 'Get payments received by doctor' })
    getPaymentsReceived(@Req() req: AuthenticatedRequest) {
        return this.paymentsService.getPaymentsByDoctor(req.user.userId);
    }
}
