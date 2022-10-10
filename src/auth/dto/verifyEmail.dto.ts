import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { toLowerCase } from '../../lib/helpers';

export class VerifyEmailDto {
    @ApiProperty()
    @IsEmail()
    @Transform(toLowerCase)
    email: string;
}
