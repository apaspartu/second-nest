import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotAcceptableException,
} from '@nestjs/common';
import configService from '../config/config.service';
import {
    EventInfoInterface,
    SheduleConfigInterface,
    UserInterface,
} from '../interfaces';
import * as dayjs from 'dayjs';
import { CreateEventDto } from './dto/create-event.dto';
import { ReserveItemDto } from './dto/reserve-item.dto';
import { EventService } from '../event/event.service';
import { ItemService } from '../item/item.service';
import * as crypto from 'crypto';
import { emitKeypressEvents } from 'readline';
import { WsException } from '@nestjs/websockets';

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

    async createEvent(dto: CreateEventDto, user: UserInterface) {
        let event = await this.eventService.getIncompleteEvent(user.id);
        if (!event) {
            throw new WsException('Any item was not reserved');
        }

        const eventInfo: EventInfoInterface = {
            ...dto,
            author: user.name,
            email: user.email,
        };
        await this.eventService.fillEmptyFields(event.id, eventInfo);
        await this.eventService.setEventCompleted(event.id);

        await event.reload();
        return event;
    }

    async reserveItem(itemId: string, user: UserInterface) {
        let item = await this.itemService.getItem(itemId);
        let event = await this.eventService.getIncompleteEvent(user.id);
        if (!event) {
            // if event DOES NOT EXIST
            if (item) {
                throw new WsException('Selected item is already taken');
            }

            event = await this.eventService.createEmptyEvent(user.id);
            item = await this.itemService.createItem(itemId, event.id);
        } else {
            // if event EXISTS
            if (item && item.eventId === event.id) {
                // toggle item to false (delete it)
                // if it is last item of event, delete event and item will be deleted automatically
                if (
                    (await this.itemService.getEventItemsCount(event.id)) === 1
                ) {
                    await this.eventService.deleteEvent(event.id);
                } else {
                    await this.itemService.deleteItem(itemId);
                }
            } else if (item && item.eventId !== event.id) {
                throw new WsException('You do not own selected item');
            } else {
                // toggle item to true (create it)
                item = await this.itemService.createItem(itemId, event.id);
            }
        }

        return item;
    }

    async deleteEvent(eventId: string, user: UserInterface) {
        const event = await this.eventService.getEvent(eventId);
        if (!event) {
            throw new WsException('Event does not exist');
        }

        if (user.role === 'admin') {
            return await this.eventService.deleteEvent(eventId);
        } else {
            if (event.userId === user.id) {
                return await this.eventService.deleteEvent(eventId);
            } else {
                throw new WsException('You do not own this event');
            }
        }
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
                    items: await this.getItems(
                        currentDate.format('YYYY-MM-DD')
                    ),
                });
            }
        }

        return schedule;
    }

    async getItems(date: string) {
        const start = dayjs().hour(this.configuration.startHour).minute(0);
        const end = this.configuration.endHour; // hours to minutes
        const step = this.configuration.step; // in minutes

        const items = [];
        for (let t = start; t.hour() < end; t = t.add(step, 'minute')) {
            const id = `${date}/${t.format('HH:mm')}`;
            const itemObject = await this.itemService.getItem(id);
            const eventId = itemObject ? itemObject.eventId : null;

            items.push({
                time: t.format('HH:mm'),
                id: id,
                eventId: eventId,
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

    async getAllEvents() {
        return await this.eventService.getAllCompleteEvents({
            withItems: true,
        });
    }
}
