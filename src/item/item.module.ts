import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ItemModel } from '../models/item.model';
import { ItemService } from './item.service';

@Module({
    imports: [SequelizeModule.forFeature([ItemModel]), ItemModel],
    providers: [ItemService],
})
export class ItemModule {}
