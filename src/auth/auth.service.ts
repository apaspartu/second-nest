import {
    ConflictException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { JwtService } from './jwt.service';
import * as cryptoJs from 'crypto-js';
import { UserDbService } from '../user/user.db.service';
import { UserModel } from '../models/user.model';
import { CreateProfileDto } from './dto/createProfile.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { Response } from 'express';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';
import configService from '../config/config.service';
import { ResetPasswordDto } from './dto/resetPasswordDto';

// noinspection DuplicatedCode
@Injectable()
export class AuthService {
    constructor(
        private readonly userDBService: UserDbService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService
    ) {}

    async signIn(dto: LoginUserDto, res: Response) {
        // Get profile from database
        const profile = await this.authenticateUser(dto.email, dto.password);
        // Generate session id
        const sessionId = this.generateSessionId();
        // Generate JWT tokens
        const accessPayload = {
            email: profile.email,
            id: profile.id,
            name: profile.name,
            role: profile.role,
            sessionId: sessionId,
        };
        const refreshPayload = { sessionId: sessionId };

        const tokens = this.jwtService.generateTokens(
            accessPayload,
            refreshPayload
        );
        await this.userDBService.setSessionId(profile.email, sessionId);
        res.cookie('refreshToken', tokens.refreshToken, {
            path: '/auth/refresh',
        });

        return { accessToken: tokens.accessToken };
    }

    async createUser(dto: CreateProfileDto, res: Response) {
        const { name, inviteToken, password } = dto;
        let email;
        try {
            email = this.jwtService.verifyToken(inviteToken).email;
        } catch (e) {
            console.log(e);
            throw new ForbiddenException('Invalid invite token');
        }

        const hashedPassword = this.hash(password);

        const sessionId = this.generateSessionId();

        const profile = await this.userDBService.createUser(
            name,
            email,
            hashedPassword
        );

        // Generate tokens
        const accessPayload = {
            email: profile.email,
            id: profile.id,
            name: profile.name,
            role: profile.role,
            sessionId: sessionId,
        };
        const refreshPayload = { sessionId: sessionId };

        const tokens = this.jwtService.generateTokens(
            accessPayload,
            refreshPayload
        );

        await this.userDBService.setSessionId(profile.email, sessionId);

        res.cookie('refreshToken', tokens.refreshToken, {
            path: '/auth/refresh',
        });

        return { accessToken: tokens.accessToken };
    }

    async verifyEmail(dto: VerifyEmailDto, origin): Promise<boolean> {
        const email = dto.email;

        const profile = await this.userDBService.getUserByOptions({ email });
        if (profile) {
            throw new ConflictException('Email already taken');
        }

        const payload = { email: email };
        const jwt = this.jwtService.generateToken(payload);

        const url = origin + '/sign-up/' + jwt;
        console.log(url);
        await this.mailService.sendInviteMail(email, url);
        return true;
    }

    async forgotPassword(dto: VerifyEmailDto, origin) {
        const { email } = dto;

        await this.userDBService.getUser(email);

        const payload = { email: email };
        const jwt = this.jwtService.generateToken(payload);

        const url = origin + '/reset-password/' + jwt;
        console.log(url);
        await this.mailService.sendResetMail(email, url);
        return true;
    }

    async resetPassword(dto: ResetPasswordDto) {
        const { resetToken, newPassword } = dto;
        console.log(resetToken);

        let email;
        try {
            email = this.jwtService.verifyToken(resetToken).email;
        } catch (e) {
            console.log(e);
            throw new ForbiddenException('Invalid invite token');
        }

        const hashedPassword = this.hash(newPassword);

        await this.userDBService.setSessionId(email, null);

        return await this.userDBService.setPassword(email, hashedPassword);
    }

    async refresh(token: string, res: Response) {
        let sessionId;
        try {
            sessionId = this.jwtService.verifyRefresh(token).sessionId;
        } catch (e) {
            throw new ForbiddenException('Invalid refresh token');
        }

        if (sessionId === null) {
            throw new ForbiddenException();
        }

        let profile;
        try {
            profile = await this.userDBService.getUserByOptions(
                {
                    sessionId,
                },
                true
            );
        } catch (e) {
            res.clearCookie('refreshToken');
            throw new ForbiddenException();
        }

        sessionId = this.generateSessionId();
        const accessPayload = {
            email: profile.email,
            id: profile.id,
            name: profile.name,
            role: profile.role,
            sessionId: sessionId,
        };
        const refreshPayload = { sessionId: sessionId };

        const tokens = this.jwtService.generateTokens(
            accessPayload,
            refreshPayload
        );

        await this.userDBService.setSessionId(profile.email, sessionId);

        res.cookie('refreshToken', tokens.refreshToken, {
            path: '/auth/refresh',
        });

        return { accessToken: tokens.accessToken };
    }

    // Check whether password matches email
    async authenticateUser(
        email: string,
        password: string
    ): Promise<UserModel> {
        const hashedPassword = this.hash(password);

        const profile = await this.userDBService.getUser(email);

        if (profile && profile.password === hashedPassword) {
            return profile;
        } else {
            throw new ForbiddenException('Incorrect password');
        }
    }

    async logout(request, response) {
        const { sessionId } = request.user;
        const { email } = await this.userDBService.getUserByOptions(
            {
                sessionId,
            },
            true
        );
        response.clearCookie('refreshToken');
        return await this.userDBService.setSessionId(email, null);
    }

    generateSessionId() {
        return crypto.randomUUID();
    }

    hash(raw: string): string {
        return cryptoJs
            .SHA256(raw + configService.getPasswordSecret())
            .toString();
    }
}
