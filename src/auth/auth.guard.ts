import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import { JwtService } from "./jwt.service";
import { UserDbService } from "../user/user.db.service";

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
            const authorizationHeader = String(request.headers['authorization']).split(' ');
            if (authorizationHeader[0] !== 'Bearer') {
                return false;
            }
            const jwtString = authorizationHeader[1];
            const jwt = this.jwtService.verify(jwtString, {secret: this.jwtService.jwtSecrets.access});

            //request.user = await this.userDBService.getUser(jwt.email);
            request.user = {
                email: jwt.email,
                id: jwt.id,
                name: jwt.name,
                role: jwt.role
            }

        } catch (e) {
            return false;
        }
        return true;
    }
}