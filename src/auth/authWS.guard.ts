import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { JwtService } from './jwt.service';
import { UserModel } from '../models';
import { UserDbService } from '../user/user.db.service';
import { UserInterface } from '../interfaces';

// This guard will reject if user is not authorized, that is access token verification fails

@Injectable()
export class AuthWSGuard implements CanActivate {
    userDBService: UserDbService;
    constructor(private jwtService: JwtService) {
        this.userDBService = new UserDbService(UserModel);
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const socket = context.switchToWs().getClient();
        try {
            const authorizationHeader =
                socket.handshake.headers['authorization'].split(' ');
            const jwtString = authorizationHeader[1];
            const jwt = this.jwtService.verifyAccess(jwtString);

            const profile = await this.userDBService.getUser(jwt.email);
            if (
                profile &&
                (profile.sessionId === null ||
                    profile.sessionId !== jwt.sessionId)
            ) {
                return false;
            }

            socket.user = {
                email: profile.email,
                name: profile.name,
                role: profile.role,
                id: profile.id,
                sessionId: profile.sessionId,
            };
        } catch (e) {
            return false;
        }
        return !!socket.user;
    }
}
