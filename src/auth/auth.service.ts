import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { OtpService } from 'src/otp/otp.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { errorResponse, successResponse } from 'src/utils/response.utils';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService,
        private otpService: OtpService,
    ) {}

    async hashPassword(password: string) {
        return bcrypt.hash(password, 10);
    }

    async comparePasswords(password: string, hash: string) {
        return bcrypt.compare(password, hash);
    }

    async generateJwt(user: User) {
        return this.jwtService.sign({
            sub: user.id,
            phone: user.phoneNumber,
            role: user.role,
        });
    }

    async loginUser(user: User, response: Response) {
        const token = await this.generateJwt(user);
        response.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        });
        return {
            message: 'Login successful',
            user: { id: user.id, phone: user.phoneNumber, role: user.role },
        };
    }

    async logoutUser(response: Response) {
        response.clearCookie('access_token');
        return { message: 'Logout successful' };
    }

    async validateUser(phone: string, password: string): Promise<User | null> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { phoneNumber: phone },
                omit: {
                    passwordHash: false,
                },
            });
            if (
                user &&
                (await this.comparePasswords(password, user.passwordHash))
            ) {
                return user;
            }
            return null;
        } catch (error) {
            throw new UnauthorizedException('User validation failed');
        }
    }

    async registerUser(
        phone: string,
        hashedPassword: string,
        role: 'patient' | 'doctor' | 'admin' = 'patient',
    ) {
        try {
            if (role === 'admin') {
                const existingAdmin = await this.prisma.user.findFirst({
                    where: { role: 'admin' },
                });
                if (existingAdmin) {
                    return errorResponse('Admin account already exists');
                }
            }

            const data: any = {
                phoneNumber: phone,
                passwordHash: hashedPassword,
                role,
            };

            if (role === 'patient') {
                data.patient = { create: {} };
            } else if (role === 'doctor') {
                data.doctor = {
                    create: {
                        name: 'Unnamed Doctor',
                        specialization: '',
                        workplace: '',
                        experience: 0,
                        workExperience: '',
                        educationHistory: '',
                        medicalLicense: '',
                    },
                };
            } else if (role === 'admin') {
                data.admin = { create: { name: 'System Admin' } };
            }

            const user = await this.prisma.user.create({
                data,
            });

            await this.otpService.sendOtp(phone);
            return successResponse('User registered successfully', {
                userId: user.id,
            });
        } catch (err) {
            return errorResponse('Register failed');
        }
    }

    async verifyUserPhone(phone: string): Promise<User> {
        return this.prisma.user.update({
            where: { phoneNumber: phone },
            data: { isVerified: true },
        });
    }

    async requestPasswordReset(phone: string) {
        const user = await this.prisma.user.findUnique({
            where: { phoneNumber: phone },
        });
        if (!user) {
            throw new UnauthorizedException('Phone number not found');
        }

        await this.otpService.sendOtp(phone);
        return 'OTP sent for password reset';
    }

    async resetPassword(phone: string, newPassword: string): Promise<User> {
        const hashedPassword = await this.hashPassword(newPassword);
        return this.prisma.user.update({
            where: { phoneNumber: phone },
            data: { passwordHash: hashedPassword },
        });
    }

    async getCurrentProfile(user: { userId: string; role: string }) {
        try {
            if (user.role === 'patient') {
                const patient = await this.prisma.patient.findUnique({
                    where: { userId: user.userId },
                    include: { user: true },
                });
                if (!patient) return errorResponse('Patient not found');
                return successResponse('Patient profile', patient);
            }

            if (user.role === 'doctor') {
                const doctor = await this.prisma.doctor.findUnique({
                    where: { userId: user.userId },
                    include: { user: true },
                });
                if (!doctor) return errorResponse('Doctor not found');
                return successResponse('Doctor profile', doctor);
            }

            if (user.role === 'admin') {
                const admin = await this.prisma.admin.findUnique({
                    where: { userId: user.userId },
                    include: { user: true },
                });
                if (!admin) return errorResponse('Admin not found');
                return successResponse('Admin profile', admin);
            }

            return errorResponse('Unknown role');
        } catch (error) {
            return errorResponse('Failed to fetch profile');
        }
    }
}
