import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import { JwtService } from "./jwt.service";

// This guard will reject if user is not authorized, that is access token verification fails

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        try {
            const authorizationHeader = request.headers['authorization'].split(' ');
            const jwtString = authorizationHeader[1];
            request.user = this.jwtService.verifyAccess(jwtString);
        } catch (e) {
            return false;
        }
        return !!request.user;
    }
}