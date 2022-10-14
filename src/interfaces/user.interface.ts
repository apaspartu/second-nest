import { ApiProperty } from '@nestjs/swagger';

export class UserInterface {
    @ApiProperty()
    email: string;
    @ApiProperty()
    id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    role: string;
    @ApiProperty()
    sessionId: string;
}

export class UserShortInfo {
    id: string;
    email: string;
    name: string;
}
