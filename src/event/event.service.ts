import { Injectable } from '@nestjs/common';
import { EventModel } from '../models';
import { InjectModel } from '@nestjs/sequelize';
import { EventInfoInterface } from '../interfaces';

@Injectable()
export class EventService {
    constructor(
        @InjectModel(EventModel) private eventModel: typeof EventModel
    ) {}

    async createEmptyEvent(userId: string): Promise<EventModel> {
        return this.eventModel.create({
            userId,
        });
    }

    async getEvent(id: string): Promise<EventModel> {
        return this.eventModel.findOne({ where: { id: id } });
    }

    async getIncompleteEvent(userId: string): Promise<EventModel> {
        return this.eventModel.findOne({
            where: { userId: userId, isCompleted: false },
        });
    }

    async deleteEvent(id: string): Promise<boolean> {
        return (await this.eventModel.destroy({ where: { id: id } })) === 1;
    }

    async fillEmptyFields(id: string, eventInfo: EventInfoInterface) {
        return (
            (
                await this.eventModel.update(eventInfo, {
                    where: { id: id },
                })
            )[0] === 1
        );
    }

    async setEventCompleted(id: string) {
        return await this.eventModel.update(
            { isCompleted: true },
            { where: { id: id } }
        );
    }
}
