import {Controller, Get, Post, Body, UseGuards, Req} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/loginUser.dto";
import { CreateProfileDto } from "./dto/createProfile.dto";
import { TokenDto } from "./dto/token.dto";
import { AuthGuard } from "./auth.guard";
import { MailService } from "../mail/mail.service";
import {VerifyEmailDto} from "./dto/verifyEmail.dto";
import {Request} from "express";


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
                private readonly mailService: MailService) {}

    @Post('sign-in')
    async signIn(@Req() req, @Body() loginUserDto: LoginUserDto) {
        return await this.authService.signIn(loginUserDto);
    }

    @Post('verify-email')
    async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto, @Req() req: Request) {
        const origin = req.protocol + '://' + req.hostname;
        return this.authService.verifyEmail(verifyEmailDto, origin);
    }

    @Post('create-user')
    async createUser(@Body() createProfileDto: CreateProfileDto) {
        return await this.authService.createUser(createProfileDto);
    }

    @Post('refresh')
    @UseGuards(AuthGuard)
    async refresh(@Body() tokenDto: TokenDto, @Req() req: Request) {
        console.log(req.user)
        return await this.authService.refresh(tokenDto);
    }

    @Get('home')
    @UseGuards(AuthGuard)
    async home(@Req() req) {
        this.mailService.sendMail('vladuslavvin@gmail.com', 'hello');
        return req.user;
    }
}
