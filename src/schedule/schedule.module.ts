import { Module } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '../auth/jwt.service';
import { ScheduleController } from './schedule.controllers';
import { ScheduleService } from './schedule.service';

@Module({
    imports: [],
    controllers: [ScheduleController],
    providers: [AuthGuard, JwtService, ScheduleService],
})
export class ScheduleModule {}
