import {
    Body,
    Controller,
    Get,
    ParseIntPipe,
    Post,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ScheduleService } from './schedule.service';
import { AuthGuard } from '../auth/auth.guard';
import { EventService } from '../event/event.service';
import * as crypto from 'crypto';
import { ItemService } from '../item/item.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ReserveItemsDto } from './dto/reserve-items.dto';

@Controller('schedule')
export class ScheduleController {
    constructor(
        private readonly scheduleService: ScheduleService,
        private readonly eventService: EventService,
        private readonly itemService: ItemService
    ) {}

    @Get()
    @UseGuards(AuthGuard)
    async get(
        @Query('year', ParseIntPipe) year,
        @Query('month', ParseIntPipe) month
    ) {
        return this.scheduleService.generate(year, month);
    }

    @Post('create-event')
    @UseGuards(AuthGuard)
    async createEvent(
        @Body() createEventDto: CreateEventDto,
        @Req() req: Request
    ) {
        return this.scheduleService.createEvent(createEventDto, req);
    }

    @Post('reserve-items')
    @UseGuards(AuthGuard)
    async reserveItems(
        @Body() reserveItemsDto: ReserveItemsDto,
        @Req() req: Request
    ) {
        return await this.scheduleService.reserveItems(reserveItemsDto, req);
    }
}
