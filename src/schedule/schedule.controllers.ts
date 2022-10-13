import {
    Body,
    Controller,
    Get,
    ParseIntPipe,
    Post,
    Query,
    Delete,
    UseGuards,
    Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ScheduleService } from './schedule.service';
import { AuthHTTPGuard } from '../auth/authHTTP.guard';
import { EventService } from '../event/event.service';
import { ItemService } from '../item/item.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ReserveItemDto } from './dto/reserve-item.dto';
import { DeleteEventDto } from './dto/delete-event.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';

@ApiTags('schedule')
@Controller('schedule')
export class ScheduleController {
    constructor(
        private readonly scheduleService: ScheduleService,
        private readonly eventService: EventService,
        private readonly itemService: ItemService
    ) {}

    @ApiImplicitQuery({ name: 'year' })
    @ApiImplicitQuery({ name: 'month' })
    @Get()
    async get(
        @Query('year', ParseIntPipe) year,
        @Query('month', ParseIntPipe) month
    ) {
        const template = await this.scheduleService.generate(year, month);
        const events = await this.eventService.getAllCompleteEvents();

        return {
            template,
            events,
        };
    }
}
