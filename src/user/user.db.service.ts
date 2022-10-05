import { Injectable } from "@nestjs/common";
import { Sequelize } from 'sequelize-typescript';
import {InjectModel} from "@nestjs/sequelize";
import {UserModel} from "./user.model";

@Injectable()
export class UserDbService {
    constructor(private sequelize: Sequelize, @InjectModel(UserModel) private userModel: typeof UserModel) {}

    async createUser(name: string, email: string, password: string) {
        let profile = await this.userModel.findOne({where: {email: email}});
        if (profile) {
            throw new Error('Email already taken');
        }

        profile = await this.userModel.create({name, email, password});
        if (profile) {
            return profile;
        } else {
            throw new Error('Something went wrong')
        }
    }
    async getUser(email: string) {
        const profile = await this.userModel.findOne({where: {email: email}});
        if (profile) {
            return profile;
        } else {
            throw new Error('Not found')
        }
    }
    async deleteUser(email: string) {
        const count = await this.userModel.destroy({where: {email: email}});
        if (count === 1) {
            return true;
        } else {
            throw new Error('Something went wrong')
        }
    }
    async changeRole(email: string, newRole: string) {
        const result = await this.userModel.update(
            {role: newRole},
            {where: {email: email}}
        );
        if (result[0] === 1) {
            return true;
        } else {
            throw new Error('Something went wrong');
        }
    }
    async setRefresh(email: string, newToken) {
        const result = await this.userModel.update(
            {refreshToken: newToken},
            {where: {email: email}}
        );
        if (result[0] === 1) {
            return true;
        } else {
            throw new Error('Something went wrong');
        }
    }
}
