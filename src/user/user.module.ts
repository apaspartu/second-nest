import { Module } from '@nestjs/common';
import {UserModel} from "./user.model";

import {UserDbService} from "./user.db.service";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [],
    controllers: [],
    providers: [],
    exports: []
})
export class UserModule {}