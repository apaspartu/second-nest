import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ItemModel } from '../models';

@Injectable()
export class ItemService {
    constructor(@InjectModel(ItemModel) private itemModel: typeof ItemModel) {}

    async createItem(id: string, eventId: string): Promise<ItemModel> {
        return this.itemModel.create({
            id,
            eventId,
        });
    }

    async getItem(id: string): Promise<ItemModel> {
        return this.itemModel.findOne({
            where: { id: id },
        });
    }

    async deleteItem(id: string): Promise<boolean> {
        return (
            (await this.itemModel.destroy({
                where: { id: id },
            })) === 1
        );
    }

    async getEventItemsCount(eventId) {
        return (await this.itemModel.findAll({ where: { eventId: eventId } }))
            .length;
    }
}
