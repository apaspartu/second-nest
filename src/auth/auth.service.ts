import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import { JwtService } from './jwt.service';
import * as cryptoJs from 'crypto-js';
import { UserDbService } from '../user/user.db.service';
import { UserModel } from "../user/user.model";
import {CreateProfileDto} from "./dto/createProfile.dto";
import {TokenDto} from "./dto/token.dto";
import {LoginUserDto} from "./dto/loginUser.dto";
import {VerifyEmailDto} from "./dto/verifyEmail.dto";
import TakenEmailException from "../exceptions/taken.email.exc";
import {AccRefTokens} from "../interfaces/ac.tokens.interface";
import IncorrectPasswordExc from "../exceptions/incorrect.password.exc";

@Injectable()
export class AuthService {
    constructor(
    private readonly userDBService: UserDbService,
    private readonly jwtService: JwtService,
    ) {}

    async signIn(dto: LoginUserDto): Promise<AccRefTokens> {
    // Get profile from database
        let profile = await this.authenticateUser(dto.email, dto.password);
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
        await this.userDBService.setRefresh(profile.email, tokens.refreshToken);

        return tokens;
    }

    async createUser(dto: CreateProfileDto): Promise<AccRefTokens> {
        const {name, inviteToken, password } = dto;
        const {email} = this.jwtService.verifyToken(inviteToken);

        const hashedPassword = this.hash(password);

        // Get profile from database
        const profile  = await this.userDBService.createUser(
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

        await this.userDBService.setRefresh(profile.email, tokens.refreshToken);

        return tokens;
    }

    async verifyEmail(dto: VerifyEmailDto, origin): Promise<void> {
        const email = dto.email;

        const profile = await this.userDBService.getUser(email);
        if (profile) {
            throw new TakenEmailException();
        }

        const payload = {email: email};
        const jwt = this.jwtService.generateToken(payload);

        const url = origin + '/sign-up/' + jwt;
        console.log(url)
        // await this.mailService.sendMail(email, url)
    }

    async refresh(dto: TokenDto): Promise<AccRefTokens> {
        // Check whether refresh token is valid
        const jwt = this.jwtService.verifyRefresh(dto.token);
        // Get refresh token from db and check whether it is same as given
        const profile = await this.userDBService.getUser(jwt.email);
        if (!profile) {
            throw new NotFoundException()
        }
        if (profile.refreshToken !== dto.token) {
            throw new ForbiddenException();
        }

        const accessPayload = {
            email: profile.email,
            id: profile.id,
            name: profile.name,
            role: profile.role,
        };
        const refreshPayload = { email: profile.email };

        const tokens = this.jwtService.generateTokens(accessPayload, refreshPayload);

        await this.userDBService.setRefresh(profile.email, tokens.refreshToken);

        return tokens;
    }

    // Check whether password matches email
    async authenticateUser(email: string, password: string): Promise<UserModel> {
        const hashedPassword = this.hash(password);

        let profile = await this.userDBService.getUser(email);

        if (profile && profile.password === hashedPassword) {
            return profile;
        } else {
            throw new IncorrectPasswordExc();
        }
    }

    hash(raw: string): string {
        return cryptoJs.SHA256(raw).toString();
    }
}
