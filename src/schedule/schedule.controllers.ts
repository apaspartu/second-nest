import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { EventService } from '../event/event.service';
import { ItemService } from '../item/item.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { AccessTokenInterface } from '../interfaces';
import { ScheduleInterface } from '../interfaces';

@ApiTags('schedule')
@Controller('schedule')
export class ScheduleController {
    constructor(
        private readonly scheduleService: ScheduleService,
        private readonly eventService: EventService,
        private readonly itemService: ItemService
    ) {}

    @ApiResponse({ type: ScheduleInterface })
    @ApiImplicitQuery({ name: 'year' })
    @ApiImplicitQuery({ name: 'month' })
    @Get()
    async get(
        @Query('year', ParseIntPipe) year: number,
        @Query('month', ParseIntPipe) month: number
    ): Promise<ScheduleInterface> {
        const template = await this.scheduleService.generate(year, month);
        const events = await this.eventService.getAllCompleteEvents();
        return {
            template,
            events,
        };
    }
}
