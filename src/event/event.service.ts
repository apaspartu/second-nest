import { Injectable } from '@nestjs/common';
import { EventModel } from '../models/event.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class EventService {
    constructor(
        @InjectModel(EventModel) private eventModel: typeof EventModel
    ) {}

    async createEmptyEvent(userId: string) {
        return await this.eventModel.create({
            userId,
        });
    }

    async getEvent(id: string) {
        return await this.eventModel.findOne({ where: { id: id } });
    }

    async deleteEvent(id: string) {
        return await this.eventModel.destroy({ where: { id: id } });
    }

    async fillEmptyFields(
        id: string,
        title: string,
        author: string,
        email: string,
        description: string,
        color: string
    ) {
        return await this.eventModel.update(
            { title, author, email, description, color },
            {
                where: { id: id },
            }
        );
    }

    async setEventCompleted(id) {
        return await this.eventModel.update(
            { isCompleted: true },
            { where: { id: id } }
        );
    }
}
