import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {jwtConstants} from "./constants";
import * as cryptoJs from 'crypto-js';
import { UserDbService } from "./user.db.service";

function hash(raw) {
    return cryptoJs.SHA256(raw).toString()
}

@Injectable()
export class AuthService {
    constructor(private readonly userDBService: UserDbService,
                private jwtService: JwtService) {}

    async signIn(dto) {
        let profile;
        try {
            profile = await this.authenticateUser(dto.email, dto.password);
        } catch (e) {
            return e.message;
        }

        const payload = { email: profile.email };
        const tokens = {
            access_token: this.jwtService.sign(payload, {
                secret: jwtConstants.accessSecret,
                expiresIn: '1h'
            }),
            refresh_token: this.jwtService.sign(payload, {
                secret: jwtConstants.refreshSecret,
                expiresIn: '7d'
            }),
        };

        await this.userDBService.setRefresh(profile.email, tokens.refresh_token);

        return tokens;
    }
    async signUp(dto) {
        const hashedPassword = hash(dto.password);

        let profile;
        try {
            profile = await this.userDBService.createUser(
                dto.name, dto.email.toLowerCase(), hashedPassword
            );
        } catch (e) {
            return e.message;
        }

        const payload = { email: profile.email };

        const tokens = {
            access_token: this.jwtService.sign(payload, {
                secret: jwtConstants.accessSecret,
                expiresIn: '1h'
            }),
            refresh_token: this.jwtService.sign(payload, {
                secret: jwtConstants.refreshSecret,
                expiresIn: '7d'
            }),
        };

        await this.userDBService.setRefresh(profile.email, tokens.refresh_token);

        return tokens;
    }
    async refresh(dto) {
        const jwt = await this.jwtService.verify(dto.token, {secret: jwtConstants.refreshSecret})

        const profile = await this.userDBService.getUser(jwt.email);
        if (profile.refreshToken !== dto.token) {
            return 'Access denied'
        }

        const payload = {email: jwt.email};

        const tokens = {
            access_token: this.jwtService.sign(payload, {
                secret: jwtConstants.accessSecret,
                expiresIn: '1h'
            }),
            refresh_token: this.jwtService.sign(payload, {
                secret: jwtConstants.refreshSecret,
                expiresIn: '7d'
            }),
        };

        await this.userDBService.setRefresh(payload.email, tokens.refresh_token);

        return tokens;
    }

    async authenticateUser(email, password) {
        const hashedPassword = hash(password);

        let profile;
        try {
            profile = await this.userDBService.getUser(email);
        } catch (e) {
            if (e.message === 'Not found') {
                throw new Error('Not found');
            } else {
                throw new Error('Something went wrong');
            }
        }

        if (profile.password === hashedPassword) {
            return profile;
        } else {
            throw new Error('Incorrect password');
        }

    }
}
