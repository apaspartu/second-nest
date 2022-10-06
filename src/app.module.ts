import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from "./auth/auth.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModel } from "./user/user.model";
import {UserModule} from "./user/user.module";
import configService from "./config/config.service";

@Module({
  imports: [AuthModule,
            SequelizeModule.forRoot({
                ...configService.getSequelizeConfig(),
                models: [UserModel]
                }
            ),
      UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
