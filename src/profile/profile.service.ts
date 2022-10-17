import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UserDbService } from '../user/user.db.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as cryptoJs from 'crypto-js';
import configService from '../config/config.service';
import { UserModel } from '../models';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class ProfileService {
    constructor(private readonly userDBService: UserDbService) {}

    async getProfile(id: string): Promise<UserModel> {
        const profile = this.userDBService.getUserByOptions({ id }, false, [
            'id',
            'name',
            'email',
            'role',
        ]);
        if (!profile) {
            throw new NotFoundException('Profile not found');
        }
        return profile;
    }

    async updateProfile(email, dto: UpdateProfileDto): Promise<boolean> {
        let res = await this.userDBService.updateProfile(email, dto);
        return res;
    }

    async updatePassword(email, dto: UpdatePasswordDto): Promise<boolean> {
        const { oldPassword, newPassword } = dto;
        const currentPasswordHash = (await this.userDBService.getUser(email))
            .password;

        if (this.hash(oldPassword) !== currentPasswordHash) {
            throw new ForbiddenException('Old password is incorrect');
        }

        return await this.userDBService.setPassword(
            email,
            this.hash(newPassword)
        );
    }

    hash(raw: string): string {
        return cryptoJs
            .SHA256(raw + configService.getPasswordSecret())
            .toString();
    }
}
