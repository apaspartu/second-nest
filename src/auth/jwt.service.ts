import { JwtService as jwtServ } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import configService from "../config/config.service";
import {
    AccessTokenPayloadInterface,
    RefreshTokenPayloadInterface,
    AccRefTokens,
    InviteTokenPayloadInterface,
} from "../interfaces";

@Injectable()
export class JwtService extends jwtServ {
    constructor() {
        super();
    }

    public jwtSecrets = configService.getJwtSecretsConfig();
    public jwtExpirations = configService.getJwtExpirationConfig();

    generateTokens(
        accessPayload: AccessTokenPayloadInterface,
        refreshPayload: RefreshTokenPayloadInterface
    ): AccRefTokens {
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
    generateToken(
        payload,
        options = {
            secret: this.jwtSecrets.access,
            expiresIn: "1h",
        }
    ) {
        return this.sign(payload, options);
    }
    verifyRefresh(token: string): RefreshTokenPayloadInterface {
        return this.verify(token, { secret: this.jwtSecrets.refresh });
    }
    verifyAccess(token: string): AccessTokenPayloadInterface {
        return this.verify(token, { secret: this.jwtSecrets.access });
    }
    verifyToken(token: string): InviteTokenPayloadInterface {
        return this.verify(token, { secret: this.jwtSecrets.access });
    }
}
