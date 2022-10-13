import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { EventModel } from '../models';

@Module({
    imports: [SequelizeModule.forFeature([EventModel]), EventModule],
    providers: [EventService],
})
export class EventModule {}
