import { JwtService as jwtServ } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import configService from "../config/config.service";

@Injectable()
export class JwtService extends jwtServ {
    constructor() {
        super();
    }

    public jwtSecrets = configService.getJwtSecretsConfig();
    public jwtExpirations = configService.getJwtExpirationConfig();

    generateTokens(accessPayload: any, refreshPayload: any): any {
        return {
            access_token: this.sign(accessPayload, {
                secret: this.jwtSecrets.access,
                expiresIn: this.jwtExpirations.access,
            }),
            refresh_token: this.sign(refreshPayload, {
                secret: this.jwtSecrets.refresh,
                expiresIn: this.jwtExpirations.refresh,
            }),
        };
    }
}