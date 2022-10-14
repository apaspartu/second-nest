import { Injectable } from '@nestjs/common';
import { EventModel, ItemModel, UserModel } from '../models';
import { InjectModel } from '@nestjs/sequelize';
import {
    EventInfoInterface,
    UserInterface,
    UserShortInfo,
} from '../interfaces';

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

    async getIncompleteEvent(userId: string) {
        return await this.eventModel.findOne({
            where: { userId: userId, isCompleted: false },
            include: [
                { model: UserModel, attributes: ['id', 'email', 'name'] },
                ItemModel,
            ],
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

    async getAllCompleteEvents(options = { withItems: false }) {
        return await this.eventModel.findAll({
            where: { isCompleted: true },
            include: options.withItems
                ? [
                      { model: UserModel, attributes: ['id', 'email', 'name'] },
                      ItemModel,
                  ]
                : { model: UserModel, attributes: ['id', 'email', 'name'] },
        });
    }
}
