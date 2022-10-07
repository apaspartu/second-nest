import { Injectable } from '@nestjs/common';
import { JwtService } from './jwt.service';
import * as cryptoJs from 'crypto-js';
import { UserDbService } from '../user/user.db.service';
import { UserModel } from "../user/user.model";
import {CreateProfileDto} from "./dto/createProfile.dto";
import {TokenDto} from "./dto/token.dto";
import {LoginUserDto} from "./dto/loginUser.dto";
import {VerifyEmailDto} from "./dto/verifyEmail.dto";
import {MailService} from "../mail/mail.service";

@Injectable()
export class AuthService {
    constructor(
    private readonly userDBService: UserDbService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    ) {}

    async signIn(dto: LoginUserDto) {
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

    async createUser(dto: CreateProfileDto) {
        const {name, inviteToken, password } = dto;
        const {email} = this.jwtService.verifyEmail(inviteToken);

        const hashedPassword = this.hash(password);

        // Get profile from database
        let profile;
        profile = await this.userDBService.createUser(
            name,
            email,
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

    async verifyEmail(dto: VerifyEmailDto, origin) {
        const payload = {email: dto.email};
        const email = dto.email;
        const jwt = this.jwtService.generateToken(payload,
            {secret: this.jwtService.jwtSecrets.access,
                    expiresIn: this.jwtService.jwtExpirations.emailVerify});

        const url = origin + '/sign-up/' + jwt;
        await this.mailService.sendMail(email, url)
    }

    async refresh(dto: TokenDto) {
        // Check whether refresh token is valid
        const jwt = this.jwtService.verifyRefresh(dto.token);
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
