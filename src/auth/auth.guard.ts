import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { UserDbService } from "./user.db.service";
import * as dotenv from 'dotenv';

dotenv.config()

const jwtSecrets = {
    access: process.env.ACCESS_SECRET,
    refresh: process.env.REFRESH_SECRET,
}

// This guard will reject if user is not authorized, that is access token verification fails

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly userDBService: UserDbService,
                private jwtService: JwtService) {}
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        try {
            const jwtString = String(request.headers['authorization']).split(' ')[1];
            const jwt = this.jwtService.verify(jwtString, {secret: jwtSecrets.access});

            //request.user = await this.userDBService.getUser(jwt.email);
            request.user = {
                email: jwt.email,
            }

        } catch (e) {
            console.log(e)
            return false;
        }
        return true;
    }
}