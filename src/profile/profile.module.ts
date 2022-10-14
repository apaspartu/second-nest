import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserDbService } from '../user/user.db.service';
import { UserModel } from '../models';
import { UserModule } from '../user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtService } from '../auth/jwt.service';

@Module({
    imports: [SequelizeModule.forFeature([UserModel]), UserModule],
    controllers: [ProfileController],
    providers: [ProfileService, UserDbService, JwtService],
})
export class ProfileModule {}
