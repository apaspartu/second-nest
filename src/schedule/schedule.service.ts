import { Injectable } from '@nestjs/common';
import configService from '../config/config.service';
import { SheduleConfigInterface } from '../interfaces';
import * as dayjs from 'dayjs';

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

    constructor() {
        this.configuration = configService.getScheduleConfig();
    }

    async generate(year, month) {
        const currentMonth = dayjs(`${year}-${month}`);
        const daysInMonth = currentMonth.daysInMonth();

        const schedule = {
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
}
