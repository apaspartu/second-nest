import { ApiProperty } from '@nestjs/swagger';
import { ItemModel } from '../models';

class EventModel {
    @ApiProperty()
    id: string;
    @ApiProperty()
    userId: string;
    @ApiProperty()
    isCompleted: boolean;
    @ApiProperty()
    title: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    color: string;
}

class Day {
    @ApiProperty()
    date: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    items: ItemModel[];
}

class Template {
    @ApiProperty()
    year: number;
    @ApiProperty()
    month: number;
    @ApiProperty()
    startHour: number;
    @ApiProperty()
    endHour: number;
    @ApiProperty()
    step: number;
    @ApiProperty()
    days: Day[];
}

export class ScheduleInterface {
    @ApiProperty()
    template: Template;
    @ApiProperty()
    events: EventModel[];
}
