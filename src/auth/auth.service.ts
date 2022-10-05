import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as cryptoJs from 'crypto-js';
import { UserDbService } from "./user.db.service";
import * as dotenv from 'dotenv';

dotenv.config()

function hash(raw) {
    return cryptoJs.SHA256(raw).toString()
}

const jwtSecrets = {
    access: process.env.ACCESS_SECRET,
    refresh: process.env.REFRESH_SECRET,
}

const jwtExpiration = {
    access: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    refresh: process.env.REFRESH_TOKEN_EXPIRE_TIME
}

@Injectable()
export class AuthService {
    constructor(private readonly userDBService: UserDbService,
                private jwtService: JwtService) {}

    async signIn(dto) {
        // Get profile from database
        let profile;
        try {
            profile = await this.authenticateUser(dto.email, dto.password);
        } catch (e) {
            return e.message;
        }
        // Generate JWT tokens
        const accessPayload = {
            email: profile.email, id: profile.id,
            name: profile.name, role: profile.role };
        const refreshPayload = { email: profile.email };

        const tokens = this.generateTokens(accessPayload, refreshPayload)

        // Set refresh token on User model in database
        await this.userDBService.setRefresh(profile.email, tokens.refresh_token);

        return tokens;
    }
    async signUp(dto) {
        const hashedPassword = hash(dto.password);

        // Get profile from database
        let profile;
        try {
            profile = await this.userDBService.createUser(
                dto.name, dto.email.toLowerCase(), hashedPassword
            );
        } catch (e) {
            return e.message;
        }

        // Generate tokens
        const accessPayload = {
            email: profile.email, id: profile.id,
            name: profile.name, role: profile.role };
        const refreshPayload = { email: profile.email };

        const tokens = this.generateTokens(accessPayload, refreshPayload)


        await this.userDBService.setRefresh(profile.email, tokens.refresh_token);

        return tokens;
    }
    async refresh(dto) {
        // Check whether refresh token is valid
        const jwt = await this.jwtService.verify(dto.token, {secret: jwtSecrets.refresh})

        // Get refresh token from db and check whether it is same as given
        const profile = await this.userDBService.getUser(jwt.email);
        if (profile.refreshToken !== dto.token) {
            return 'Access denied';
        }

        const accessPayload = {
            email: profile.email, id: profile.id,
            name: profile.name, role: profile.role };
        const refreshPayload = { email: profile.email };

        const tokens = this.generateTokens(accessPayload, refreshPayload)


        await this.userDBService.setRefresh(profile.email, tokens.refresh_token);

        return tokens;
    }

    // Check whether password matches email
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
    generateTokens(accessPayload, refreshPayload) {
        return {
            access_token: this.jwtService.sign(accessPayload, {
                secret: jwtSecrets.access,
                expiresIn: jwtExpiration.access
            }),
            refresh_token: this.jwtService.sign(refreshPayload, {
                secret: jwtSecrets.refresh,
                expiresIn: jwtExpiration.refresh
            }),
        };
    }
}
