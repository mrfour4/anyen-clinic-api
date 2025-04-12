import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OtpService } from 'src/otp/otp.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { PhoneDto } from './dto/phone.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private otpService: OtpService,
    ) {}

    @Post('login')
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
    async logout(@Req() req) {
        await this.authService.logoutUser(req.res);
        return {
            message: 'Logout successful',
        };
    }

    @Post('register')
    async register(@Body() body: RegisterDto) {
        const { phone, password, role } = body;
        const hashedPassword = await this.authService.hashPassword(password);
        return await this.authService.registerUser(
            phone,
            hashedPassword,
            role || 'patient',
        );
    }

    @Post('resend-otp')
    async resendOtp(@Body() body: PhoneDto) {
        const { phone } = body;
        await this.otpService.sendOtp(phone);
        return {
            message: 'OTP resent successfully',
        };
    }

    @Post('verify-otp')
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
    async forgotPassword(@Body() body: PhoneDto) {
        const { phone } = body;
        await this.authService.requestPasswordReset(phone);
        return {
            message: 'Password reset OTP sent',
        };
    }

    @Post('reset-password')
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
    async getMe(@Req() req) {
        return this.authService.getCurrentProfile(req.user);
    }
}
