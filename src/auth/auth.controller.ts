import { Controller, Get, Post, Body, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/loginUser.dto";
import { CreateProfileDto } from "./dto/createProfile.dto";
import { TokenDto } from "./dto/token.dto";
import {AuthGuard} from "./auth.guard";


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sign-in')
    async signIn(@Request() req, @Body() loginUserDto: LoginUserDto) {
        return await this.authService.signIn(loginUserDto);
    }

    @Post('sign-up')
    async signUp(@Body() createProfileDto: CreateProfileDto) {
        return await this.authService.signUp(createProfileDto);
    }

    @Post('refresh')
    @UseGuards(AuthGuard)
    async refresh(@Body() tokenDto: TokenDto, @Request() req) {
        console.log(req.user)
        return await this.authService.refresh(tokenDto);
    }

    @Get('home')
    @UseGuards(AuthGuard)
    async home(@Request() req) {
        return req.user;
    }
}
