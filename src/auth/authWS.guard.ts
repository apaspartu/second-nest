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

            const user: UserInterface = {
                email: jwt.email,
                name: jwt.name,
                role: jwt.role,
                id: jwt.id,
                sessionId: jwt.sessionId,
            };
            socket.user = user;
        } catch (e) {
            return false;
        }
        return !!socket.user;
    }
}
