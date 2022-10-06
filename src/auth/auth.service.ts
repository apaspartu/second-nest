import { Injectable } from '@nestjs/common';
import { JwtService } from './jwt.service';
import * as cryptoJs from 'crypto-js';
import { UserDbService } from '../user/user.db.service';
import { UserModel } from "../user/user.model";

@Injectable()
export class AuthService {
    constructor(
    private readonly userDBService: UserDbService,
    private jwtService: JwtService,
    ) {}

    async signIn(dto) {
    // Get profile from database
        let profile;
        profile = await this.authenticateUser(dto.email, dto.password);
        // Generate JWT tokens
        const accessPayload = {
            email: profile.email,
            id: profile.id,
            name: profile.name,
            role: profile.role,
        };
        const refreshPayload = { email: profile.email };

        const tokens = this.jwtService.generateTokens(accessPayload, refreshPayload);

        // Set refresh token on User model in database
        await this.userDBService.setRefresh(profile.email, tokens.refresh_token);

        return tokens;
    }
    async signUp(dto) {
        const hashedPassword = this.hash(dto.password);

        // Get profile from database
        let profile;
        profile = await this.userDBService.createUser(
            dto.name,
            dto.email.toLowerCase(),
            hashedPassword,
        );

        // Generate tokens
        const accessPayload = {
            email: profile.email,
            id: profile.id,
            name: profile.name,
            role: profile.role,
        };
        const refreshPayload = { email: profile.email };

        const tokens = this.jwtService.generateTokens(accessPayload, refreshPayload);

        await this.userDBService.setRefresh(profile.email, tokens.refresh_token);

        return tokens;
    }
    async refresh(dto) {
    // Check whether refresh token is valid
        const jwt = await this.jwtService.verify(dto.token, {
            secret: this.jwtService.jwtSecrets.refresh,
        });

        // Get refresh token from db and check whether it is same as given
        const profile = await this.userDBService.getUser(jwt.email);
        if (profile.refreshToken !== dto.token) {
            return 'Access denied';
        }

        const accessPayload = {
            email: profile.email,
            id: profile.id,
            name: profile.name,
            role: profile.role,
        };
        const refreshPayload = { email: profile.email };

        const tokens = this.jwtService.generateTokens(accessPayload, refreshPayload);

        await this.userDBService.setRefresh(profile.email, tokens.refresh_token);

        return tokens;
    }

    // Check whether password matches email
    async authenticateUser(email: string, password: string): Promise<UserModel> {
        const hashedPassword = this.hash(password);

        let profile;
        profile = await this.userDBService.getUser(email);

        if (profile.password === hashedPassword) {
            return profile;
        } else {
            throw new Error('Incorrect password');
        }
    }
    hash(raw) {
        return cryptoJs.SHA256(raw, ).toString();
    }
}
