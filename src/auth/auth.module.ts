import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UserDbService} from "./user.db.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {UserModel} from './user.model';
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [SequelizeModule.forFeature([UserModel]),
              JwtModule],
    controllers: [AuthController],
    providers: [AuthService, UserDbService],
})
export class AuthModule {}