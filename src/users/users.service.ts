import { Injectable } from '@nestjs/common';
import { UpdateProductDto } from 'src/products/dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async getUserProfile(userId: number) {
        return this.prisma.user.findUnique({ where: { id: userId } });
    }

    async updateUserProfile(userId: number, data: UpdateProductDto) {
        return this.prisma.user.update({
            where: { id: userId },
            data,
        });
    }

    async deleteUserProfile(userId: number) {
        return this.prisma.user.delete({ where: { id: userId } });
    }
}
