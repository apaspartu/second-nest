import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from "./auth/auth.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModel } from "./auth/user.model";

import * as dotenv from 'dotenv';

dotenv.config()

@Module({
  imports: [AuthModule,
            SequelizeModule.forRoot({
                dialect: 'postgres',
                host: process.env.HOST,
                port: 5432,
                username: process.env.USER,
                password: process.env.PASSWORD,
                database: process.env.DATABASE,
                models: [UserModel],
                dialectOptions:
                    {ssl: { require: true,
                            rejectUnauthorized: false }}
            }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
