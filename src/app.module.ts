import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './user/user.module';
import configService from './config/config.service';
import { ScheduleModule } from './schedule/schedule.module';
import { ItemModule } from './item/item.module';
import { EventModule } from './event/event.module';
import { ItemModel, EventModel, UserModel } from './models';

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
