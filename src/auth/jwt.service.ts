import { JwtService as jwtServ } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import configService from "../config/config.service";
import {AccessTokenPayloadInterface} from "../interfaces/access.token.payload.interface";
import {RefreshTokenPayloadInterface} from "../interfaces/refresh.token.payload.interface";
import {InviteTokenPayloadInterface} from "../interfaces/invite.token.payload.interface";
import {AccRefTokens} from "../interfaces/ac.tokens.interface";

@Injectable()
export class JwtService extends jwtServ {
    constructor() {
        super();
    }

    public jwtSecrets = configService.getJwtSecretsConfig();
    public jwtExpirations = configService.getJwtExpirationConfig();

    generateTokens(accessPayload: AccessTokenPayloadInterface, refreshPayload: RefreshTokenPayloadInterface): AccRefTokens {
        return {
            accessToken: this.sign(accessPayload, {
                secret: this.jwtSecrets.access,
                expiresIn: this.jwtExpirations.access,
            }),
            refreshToken: this.sign(refreshPayload, {
                secret: this.jwtSecrets.refresh,
                expiresIn: this.jwtExpirations.refresh,
            }),
        };
    }
    generateToken(payload: any, options = {
        secret: this.jwtSecrets.access,
        expiresIn: '1h'
    }) {
        return this.sign(payload, options);
    }
    verifyRefresh(token: string): RefreshTokenPayloadInterface {
        return this.verify(token, {secret: this.jwtSecrets.refresh});
    }
    verifyAccess(token: string): AccessTokenPayloadInterface {
        return this.verify(token, {secret: this.jwtSecrets.access});
    }
    verifyToken(token: string): InviteTokenPayloadInterface {
        return this.verify(token, {secret: this.jwtSecrets.access});
    }
}