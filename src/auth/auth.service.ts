import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { OtpService } from 'src/otp/otp.service';
import { PrismaService } from 'src/prisma/prisma.service';

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
            user: {
                id: user.id,
                phone: user.phoneNumber,
                role: user.role,
            },
        };
    }

    async logoutUser(response: Response) {
        response.clearCookie('access_token');
    }

    async validateUser(phone: string, password: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { phoneNumber: phone },
            omit: {
                passwordHash: false,
            },
        });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const match = await this.comparePasswords(password, user.passwordHash);
        if (!match) throw new UnauthorizedException('Invalid credentials');

        return user;
    }

    async registerUser(
        phone: string,
        hashedPassword: string,
        role: 'patient' | 'doctor' | 'admin' = 'patient',
    ) {
        if (role === 'admin') {
            const existingAdmin = await this.prisma.user.findFirst({
                where: { role: 'admin' },
            });
            if (existingAdmin) {
                throw new BadRequestException('Admin account already exists');
            }
        }

        const data: any = {
            phoneNumber: phone,
            passwordHash: hashedPassword,
            role,
        };

        if (role === 'patient') {
            data.patient = { create: { fullName: 'Unnamed Patient' } };
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

        const user = await this.prisma.user.create({ data });
        await this.otpService.sendOtp(phone);

        return {
            message: 'User registered successfully',
            data: { userId: user.id },
        };
    }

    async verifyUserPhone(phone: string) {
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
            throw new NotFoundException('Phone number not found');
        }

        await this.otpService.sendOtp(phone);
    }

    async resetPassword(phone: string, newPassword: string) {
        const hashedPassword = await this.hashPassword(newPassword);
        return this.prisma.user.update({
            where: { phoneNumber: phone },
            data: { passwordHash: hashedPassword },
        });
    }

    async getCurrentProfile(user: { userId: string; role: string }) {
        if (user.role === 'patient') {
            const patient = await this.prisma.patient.findUnique({
                where: { userId: user.userId },
                include: { user: true },
            });
            if (!patient) throw new NotFoundException('Patient not found');
            return {
                message: 'Patient profile',
                data: patient,
            };
        }

        if (user.role === 'doctor') {
            const doctor = await this.prisma.doctor.findUnique({
                where: { userId: user.userId },
                include: { user: true },
            });
            if (!doctor) throw new NotFoundException('Doctor not found');
            return {
                message: 'Doctor profile',
                data: doctor,
            };
        }

        if (user.role === 'admin') {
            const admin = await this.prisma.admin.findUnique({
                where: { userId: user.userId },
                include: { user: true },
            });
            if (!admin) throw new NotFoundException('Admin not found');
            return {
                message: 'Admin profile',
                data: admin,
            };
        }

        throw new NotFoundException('Unknown role');
    }
}
