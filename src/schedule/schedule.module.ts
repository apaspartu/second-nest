import { Module } from '@nestjs/common';
import { AuthHTTPGuard } from '../auth/authHTTP.guard';
import { JwtService } from '../auth/jwt.service';
import { ScheduleController } from './schedule.controllers';
import { ScheduleService } from './schedule.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { EventModel } from '../models';
import { ItemModel } from '../models';
import { EventModule } from '../event/event.module';
import { EventService } from '../event/event.service';
import { ItemService } from '../item/item.service';
import { ScheduleGateway } from './schedule.gateway';

@Module({
    imports: [SequelizeModule.forFeature([EventModel, ItemModel]), EventModule],
    controllers: [ScheduleController],
    providers: [
        AuthHTTPGuard,
        JwtService,
        ScheduleService,
        EventService,
        ItemService,
        ScheduleGateway,
    ],
})
export class ScheduleModule {}
