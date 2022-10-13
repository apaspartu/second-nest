import { Injectable } from '@nestjs/common';
import { EventModel, ItemModel, UserModel } from '../models';
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
        const event = await this.eventModel.findOne({
            where: { userId: userId, isCompleted: false },
            include: [UserModel, ItemModel],
        });
        if (event) {
            event.user.password = null;
            event.user.sessionId = null;
        }
        return event;
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

    async getAllCompleteEvents(options = { withItems: false }) {
        let events = await this.eventModel.findAll({
            where: { isCompleted: true },
            include: options.withItems ? [UserModel, ItemModel] : UserModel,
        });
        events = events.map((event) => {
            event.user.password = null;
            event.user.sessionId = null;
            return event;
        });
        return events;
    }
}
