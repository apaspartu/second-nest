import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenInterface {
    @ApiProperty()
    accessToken: string;
}
