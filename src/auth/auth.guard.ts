import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import {jwtConstants} from "./constants";
import { UserDbService } from "./user.db.service";

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
            const jwtString = request.headers['authorization'];
            const jwt = this.jwtService.verify(jwtString, {secret: jwtConstants.accessSecret});

            request.user = await this.userDBService.getUser(jwt.email);

        } catch (e) {
            console.log(e)
            return false;
        }
        return true;
    }
}