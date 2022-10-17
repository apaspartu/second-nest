import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../models/user.model';

@Injectable()
export class UserDbService {
    constructor(@InjectModel(UserModel) private userModel: typeof UserModel) {}

    async getUserByOptions(
        options: WhereOptions,
        throwIfNotFound = false,
        attributes = ['id', 'name', 'email', 'role', 'password', 'sessionId']
    ): Promise<UserModel> {
        const profile = await this.userModel.findOne({
            where: options,
            attributes,
        });
        if (!profile && throwIfNotFound) {
            throw new NotFoundException();
        }
        return profile;
    }

    async createUser(name: string, email: string, password: string) {
        let profile;
        try {
            profile = await this.getUserByOptions({ email: email });
        } catch (e) {
            if (e.message !== 'Not found') {
                throw e;
            }
        }
        if (profile) {
            throw new ForbiddenException('This email is already taken');
        }

        profile = await this.userModel.create({ name, email, password });
        if (profile) {
            return profile;
        } else {
            throw new Error('Something went wrong');
        }
    }

    async getUser(email: string): Promise<UserModel> {
        return this.getUserByOptions({ email: email }, true);
    }

    async deleteUser(email: string) {
        const res = await this.userModel.destroy({ where: { email: email } });
        return res === 1;
    }

    async changeRole(email: string, newRole: string) {
        const res = await this.userModel.update(
            { role: newRole },
            { where: { email: email } }
        );
        return res[0] === 1;
    }
    async setSessionId(email: string, sessionId: string) {
        const res = await this.userModel.update(
            { sessionId: sessionId },
            { where: { email: email } }
        );
        return res[0] === 1;
    }
    async setPassword(email: string, password: string) {
        const res = await this.userModel.update(
            { password: password },
            { where: { email: email } }
        );
        return res[0] === 1;
    }

    async updateProfile(email, fields) {
        const res = await this.userModel.update(
            { ...fields },
            { where: { email: email } }
        );
        return res[0] === 1;
    }
}
