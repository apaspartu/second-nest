import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ItemModel } from '../models/item.model';

@Injectable()
export class ItemService {
    constructor(@InjectModel(ItemModel) private itemModel: typeof ItemModel) {}

    async createItem(id, eventId) {
        return await this.itemModel.create({
            id,
            eventId,
        });
    }

    async getItem(id) {
        return await this.itemModel.findOne({
            where: { id: id },
        });
    }

    async deleteItem(id) {
        return await this.itemModel.destroy({
            where: { id: id },
        });
    }
}
