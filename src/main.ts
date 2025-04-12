import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { PrismaClientExceptionFilter } from './common/filters/prisma-exception.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api/v1');

    app.use(cookieParser());

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.useGlobalFilters(
        new PrismaClientExceptionFilter(),
        new AllExceptionsFilter(),
    );

    app.useGlobalInterceptors(new TransformResponseInterceptor());

    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://10.0.2.2:3000',
            'http://192.168.1.57:3000',
        ],

        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: true,
    });

    await app.listen(8080);
    console.log('🚀 ~ Server running on http://localhost:8080/api/v1');
}

bootstrap();
