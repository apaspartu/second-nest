import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotAcceptableException,
} from '@nestjs/common';
import configService from '../config/config.service';
import { SheduleConfigInterface, UserInterface } from '../interfaces';
import * as dayjs from 'dayjs';
import { CreateEventDto } from './dto/create-event.dto';
import { ReserveItemDto } from './dto/reserve-item.dto';
import { EventService } from '../event/event.service';
import { ItemService } from '../item/item.service';
import * as crypto from 'crypto';

const DAYS = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
];

@Injectable()
export class ScheduleService {
    private readonly configuration: SheduleConfigInterface;

    constructor(
        private readonly eventService: EventService,
        private readonly itemService: ItemService
    ) {
        this.configuration = configService.getScheduleConfig();
    }

    async createEvent(dto: CreateEventDto, req) {
        // check whether eventId is valid and if its owner is userId
        // fill empty fields of event and set its items to occupied state
        return req.user;
    }

    async reserveItem(itemId: string, user: UserInterface) {
        // check whether item is free
        const item = await this.itemService.getItem(itemId);
        if (item) {
            throw new ForbiddenException('Selected item is already taken');
        }

        // create empty event for userId
        const event = await this.eventService.createEmptyEvent(user.id);

        return event.id;
    }

    async generate(year, month) {
        const currentMonth = dayjs(`${year}-${month}`);
        const daysInMonth = currentMonth.daysInMonth();

        const schedule = {
            year: year,
            month: month,
            startHour: this.configuration.startHour,
            endHour: this.configuration.endHour,
            step: this.configuration.step,
            days: [],
        };

        for (let i = 1; i < daysInMonth + 1; i++) {
            const currentDate = currentMonth.date(i);
            if (this.isWorkingDay(this.getDayName(currentDate.day()))) {
                schedule.days.push({
                    date: currentDate.format('DD-MM'),
                    name: this.getDayName(currentDate.day()).slice(0, 3),
                    items: this.getItems(currentDate.format('YYYY-MM-DD')),
                });
            }
        }

        console.log(schedule);
        return schedule;
    }

    getItems(date: string) {
        const start = dayjs().hour(this.configuration.startHour).minute(0);
        const end = this.configuration.endHour; // hours to minutes
        const step = this.configuration.step; // in minutes

        const items = [];
        for (let t = start; t.hour() < end; t = t.add(step, 'minute')) {
            items.push({
                time: t.format('HH:mm'),
                id: `${date}/${t.format('HH:mm')}`,
            });
        }
        return items;
    }

    getDayName(number: number) {
        return DAYS[number];
    }

    isWorkingDay(day: string) {
        day = day.toLowerCase();
        return this.configuration.workingDays.includes(day);
    }

    validateItemId(itemId) {
        return dayjs(itemId, 'YYYY-MM-DD/HH:mm', true).isValid();
    }

    generateItemIdsBetween(firstItemId: string, lastItemId: string): string[] {
        const start = dayjs(firstItemId, 'YYYY-MM-DD/HH:mm', true);
        const end = dayjs(lastItemId, 'YYYY-MM-DD/HH:mm', true);
        const step = this.configuration.step;

        let items = [];
        for (
            let i = start;
            i.valueOf() <= end.valueOf();
            i = i.add(step, 'minute')
        ) {
            items.push(i.format('YYYY-MM-DD/HH:mm'));
        }

        return items;
    }
}
