import * as dotenv from 'dotenv';
import {SequelizeOptions} from "sequelize-typescript";

dotenv.config()

enum RequiredVariables {
    HOST = 'HOST',
    DATABASE = 'DATABASE',
    USER = 'USER',
    PASSWORD = 'PASSWORD',

    ACCESS_TOKEN_EXPIRE_TIME = 'ACCESS_TOKEN_EXPIRE_TIME',
    REFRESH_TOKEN_EXPIRE_TIME = 'REFRESH_TOKEN_EXPIRE_TIME',

    REFRESH_SECRET = 'REFRESH_SECRET',
    ACCESS_SECRET = 'ACCESS_SECRET',
}

class ConfigService<T extends RequiredVariables> {
    constructor() {
        Object.values(RequiredVariables).forEach(key => {
            if (!process.env[key]) {
                throw new Error(`Key must be provided: ${key}`)
            }
        })
    }
    getSequelizeConfig(): SequelizeOptions {
        return {
            dialect: 'postgres',
            host: process.env.HOST,
            port: 5432,
            username: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
        };
    }
    getJwtSecretsConfig() {
        return {
            access: process.env.ACCESS_SECRET,
            refresh: process.env.REFRESH_SECRET,
        }
    }
    getJwtExpirationConfig() {
        return {
            access: process.env.ACCESS_TOKEN_EXPIRE_TIME,
            refresh: process.env.REFRESH_TOKEN_EXPIRE_TIME,
        }
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
            }
    }
}

export default new ConfigService();