import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { OtpService } from 'src/otp/otp.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { PhoneDto } from './dto/phone.dto';
import { RegisterDto, Role } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private otpService: OtpService,
    ) {}

    @Post('login')
    @ApiOperation({
        summary: 'Login with verified phone and password',
        description:
            'User must verify OTP before logging in. Login sets a JWT cookie.',
    })
    @ApiBody({
        type: LoginDto,
        examples: {
            example: {
                summary: 'Example login',
                value: {
                    phone: '0384623506',
                    password: 'password123',
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() body: LoginDto, @Req() req) {
        const { phone, password } = body;
        const user = await this.authService.validateUser(phone, password);
        const loginData = await this.authService.loginUser(user, req.res);
        return {
            message: 'Login successful',
            data: loginData,
        };
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Logout current user' })
    @ApiResponse({ status: 200, description: 'Logout successful' })
    async logout(@Req() req) {
        await this.authService.logoutUser(req.res);
        return {
            message: 'Logout successful',
        };
    }

    @Post('register')
    @ApiOperation({
        summary: 'Register new user (default: patient)',
        description:
            'If no `role` is provided, user is created as a `patient`. Valid roles: `patient`, `doctor`, `admin`.\n\nOTP will be sent to the phone and must be verified before login.',
    })
    @ApiBody({
        type: RegisterDto,
        examples: {
            patient: {
                summary: 'Register as patient (default)',
                value: {
                    phone: '0384623506',
                    password: 'password123',
                },
            },
            doctor: {
                summary: 'Register as doctor',
                value: {
                    phone: '0384623507',
                    password: 'password123',
                    role: 'doctor',
                },
            },
            admin: {
                summary: 'Register as admin (only once allowed)',
                value: {
                    phone: '0384623508',
                    password: 'adminpassword',
                    role: 'admin',
                },
            },
        },
    })
    async register(@Body() body: RegisterDto) {
        const { phone, password, role } = body;
        const hashedPassword = await this.authService.hashPassword(password);
        return await this.authService.registerUser(
            phone,
            hashedPassword,
            role || Role.patient,
        );
    }

    @Post('resend-otp')
    @ApiOperation({
        summary: 'Resend OTP to phone number',
        description:
            'OTP is valid for 60 seconds. After expiry, user can resend via this endpoint.',
    })
    @ApiBody({
        type: PhoneDto,
        examples: {
            example: {
                summary: 'Resend OTP',
                value: { phone: '0384623506' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'OTP resent successfully' })
    async resendOtp(@Body() body: PhoneDto) {
        const { phone } = body;
        await this.otpService.sendOtp(phone);
        return {
            message: 'OTP resent successfully',
        };
    }

    @Post('verify-otp')
    @ApiOperation({
        summary: 'Verify OTP sent to phone',
        description:
            'After registration, user must verify their phone via this OTP to activate login access.',
    })
    @ApiBody({
        type: VerifyOtpDto,
        examples: {
            example: {
                summary: 'Verify OTP',
                value: {
                    phone: '0384623506',
                    otp: '901200',
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Phone verified successfully' })
    async verifyOtp(@Body() body: VerifyOtpDto) {
        const { phone, otp } = body;
        const isValid = this.otpService.verifyOtp(phone, otp);
        if (!isValid) throw new Error('Invalid OTP');
        await this.authService.verifyUserPhone(phone);
        return {
            message: 'Phone number verified successfully',
        };
    }

    @Post('forgot-password')
    @ApiOperation({
        summary: 'Send OTP to reset password',
        description:
            'User provides verified phone number, system sends OTP. OTP will be used to confirm before resetting.',
    })
    @ApiBody({
        type: PhoneDto,
        examples: {
            example: {
                summary: 'Forgot password',
                value: { phone: '0384623506' },
            },
        },
    })
    async forgotPassword(@Body() body: PhoneDto) {
        const { phone } = body;
        await this.authService.requestPasswordReset(phone);
        return {
            message: 'Password reset OTP sent',
        };
    }

    @Post('reset-password')
    @ApiOperation({
        summary: 'Reset password using phone & OTP',
        description:
            'Requires phone, valid OTP, and new password. OTP must be within 60s.',
    })
    @ApiBody({
        type: ResetPasswordDto,
        examples: {
            example: {
                summary: 'Reset password with OTP',
                value: {
                    phone: '0384623506',
                    otp: '499138',
                    newPassword: 'newPassword',
                },
            },
        },
    })
    async resetPassword(@Body() body: ResetPasswordDto) {
        const { phone, otp, newPassword } = body;
        const isValid = this.otpService.verifyOtp(phone, otp);
        if (!isValid) throw new Error('Invalid or expired OTP');
        await this.authService.resetPassword(phone, newPassword);
        return {
            message: 'Password reset successfully',
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get current user profile' })
    async getMe(@Req() req) {
        return this.authService.getCurrentProfile(req.user);
    }
}
