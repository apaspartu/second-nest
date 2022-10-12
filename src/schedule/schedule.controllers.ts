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

@Controller('schedule')
export class ScheduleController {
    constructor(
        private readonly scheduleService: ScheduleService,
        private readonly eventService: EventService,
        private readonly itemService: ItemService
    ) {}

    @Get()
    @UseGuards(AuthHTTPGuard)
    async get(
        @Query('year', ParseIntPipe) year,
        @Query('month', ParseIntPipe) month
    ) {
        return this.scheduleService.generate(year, month);
    }

    @Post('create-event')
    @UseGuards(AuthHTTPGuard)
    async createEvent(@Body() createEventDto: CreateEventDto, @Req() req) {
        return this.scheduleService.createEvent(createEventDto, req.user);
    }

    @Post('reserve-item')
    @UseGuards(AuthHTTPGuard)
    async reserveItem(@Body() dto: ReserveItemDto, @Req() req) {
        return await this.scheduleService.reserveItem(dto.itemId, req.user);
    }

    @Delete('delete-event')
    @UseGuards(AuthHTTPGuard)
    async deleteEvent(@Body() deleteEventDto: DeleteEventDto, @Req() req) {
        return await this.scheduleService.deleteEvent(
            deleteEventDto.eventId,
            req.user
        );
    }
}
