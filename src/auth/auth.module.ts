import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UserDbService} from "../user/user.db.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {UserModel} from '../user/user.model';
import { JwtModule } from "@nestjs/jwt";
import { JwtService } from "./jwt.service";
import {MailModule} from "../mail/mail.module";
import {MailService} from "../mail/mail.service";


@Module({
    imports: [SequelizeModule.forFeature([UserModel]),
              JwtModule, MailModule],
    controllers: [AuthController],
    providers: [AuthService, UserDbService, JwtService, MailService],
})
export class AuthModule {}