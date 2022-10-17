import * as dotenv from 'dotenv';
import { SequelizeOptions } from 'sequelize-typescript';
import { SheduleConfigInterface } from '../interfaces';

dotenv.config();

enum RequiredVariables {
    HOST = 'HOST',
    DATABASE = 'DATABASE',
    USER = 'USER',
    PASSWORD = 'PASSWORD',
    DBPORT = 'DBPORT',

    HOST_REMOTE = 'HOST_REMOTE',
    PASSWORD_REMOTE = 'PASSWORD_REMOTE',

    PASSWORD_SECRET = 'PASSWORD_SECRET',

    ACCESS_TOKEN_EXPIRE_TIME = 'ACCESS_TOKEN_EXPIRE_TIME',
    REFRESH_TOKEN_EXPIRE_TIME = 'REFRESH_TOKEN_EXPIRE_TIME',

    REFRESH_SECRET = 'REFRESH_SECRET',
    ACCESS_SECRET = 'ACCESS_SECRET',

    SCHEDULE_STEP = 'SCHEDULE_STEP',
    WORKING_DAYS = 'WORKING_DAYS',

    START_WORK_HOUR = 'START_WORK_HOUR',
    END_WORK_HOUR = 'END_WORK_HOUR',
}

class ConfigService<T extends RequiredVariables> {
    constructor() {
        Object.values(RequiredVariables).forEach((key) => {
            if (!process.env[key]) {
                throw new Error(`Key must be provided: ${key}`);
            }
        });
    }
    getSequelizeConfig(): SequelizeOptions {
        console.log(process.env.MODE);
        return {
            dialect: 'postgres',
            host:
                process.env.MODE === 'PRODUCTION'
                    ? process.env.HOST_REMOTE
                    : process.env.HOST,
            port: parseInt(process.env.DBPORT),
            username: process.env.USER,
            password:
                process.env.MODE === 'PRODUCTION'
                    ? process.env.PASSWORD_REMOTE
                    : process.env.PASSWORD,
            database: process.env.DATABASE,
        };
    }
    getJwtSecretsConfig() {
        return {
            access: process.env.ACCESS_SECRET,
            refresh: process.env.REFRESH_SECRET,
        };
    }
    getJwtExpirationConfig() {
        return {
            access: process.env.ACCESS_TOKEN_EXPIRE_TIME,
            refresh: process.env.REFRESH_TOKEN_EXPIRE_TIME,
        };
    }
    getPasswordSecret() {
        return process.env.PASSWORD_SECRET;
    }
    getNodemailerOptions() {
        return {
            host: 'smtp.gmail.com',
            port: 587,
            ignoreTLS: false,
            secure: false,
            auth: {
                user: 'spatiumfabri@gmail.com',
                pass: 'tlktqjkivdoruyaq',
            },
            tls: {
                rejectUnauthorized: false,
            },
        };
    }
    getScheduleConfig(): SheduleConfigInterface {
        return {
            step: parseInt(process.env.SCHEDULE_STEP),
            startHour: parseInt(process.env.START_WORK_HOUR),
            endHour: parseInt(process.env.END_WORK_HOUR),
            workingDays: process.env.WORKING_DAYS.split(','),
        };
    }
}

export default new ConfigService();
