import {IsEmail, IsNotEmpty} from 'class-validator';

export class CreateProfileDto  {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}