import {IsEmail} from 'class-validator';
import {Transform} from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
    @ApiProperty()
    @IsEmail()
    email: string;
}