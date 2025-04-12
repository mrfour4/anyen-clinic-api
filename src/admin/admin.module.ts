import { Module } from '@nestjs/common';
import { StatisticsModule } from 'src/statistics/statistics.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
    imports: [StatisticsModule],
    providers: [AdminService],
    controllers: [AdminController],
})
export class AdminModule {}
