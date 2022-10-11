import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './models/user.model';
import { UserModule } from './user/user.module';
import configService from './config/config.service';
import { ScheduleModule } from './schedule/schedule.module';
import { EventModel } from './models/event.model';
import { ItemModule } from './item/item.module';
import { EventModule } from './event/event.module';
import { ItemModel } from './models/item.model';

@Module({
    imports: [
        AuthModule,
        SequelizeModule.forRoot({
            ...configService.getSequelizeConfig(),
            models: [UserModel, EventModel, ItemModel],
        }),
        UserModule,
        ScheduleModule,
        EventModule,
        ItemModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
