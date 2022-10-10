import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { toLowerCase } from '../../lib/helpers';

export class LoginUserDto {
    @ApiProperty()
    @IsEmail()
    @Transform(toLowerCase)
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}
