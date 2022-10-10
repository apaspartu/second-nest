import {
    Controller,
    Get,
    ParseIntPipe,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('schedule')
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) {}

    @Get()
    @UseGuards(AuthGuard)
    async get(
        @Query('year', ParseIntPipe) year,
        @Query('month', ParseIntPipe) month
    ) {
        return this.scheduleService.generate(year, month);
    }
}
