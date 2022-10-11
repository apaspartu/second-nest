import { Module } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '../auth/jwt.service';
import { ScheduleController } from './schedule.controllers';
import { ScheduleService } from './schedule.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { EventModel } from '../models/event.model';
import { ItemModel } from '../models/item.model';
import { EventModule } from '../event/event.module';
import { EventService } from '../event/event.service';
import { ItemService } from '../item/item.service';

@Module({
    imports: [SequelizeModule.forFeature([EventModel, ItemModel]), EventModule],
    controllers: [ScheduleController],
    providers: [
        AuthGuard,
        JwtService,
        ScheduleService,
        EventService,
        ItemService,
    ],
})
export class ScheduleModule {}
