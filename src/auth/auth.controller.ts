import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Req,
    Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { CreateProfileDto } from './dto/createProfile.dto';
import { AuthGuard } from './auth.guard';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { Request, Response } from 'express';
import { ResetPasswordDto } from './dto/resetPasswordDto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sign-in')
    async signIn(
        @Body() loginUserDto: LoginUserDto,
        @Res({ passthrough: true }) res: Response
    ) {
        return await this.authService.signIn(loginUserDto, res); //  access token
    }

    @Post('verify-email')
    async verifyEmail(
        @Body() verifyEmailDto: VerifyEmailDto,
        @Req() req: Request
    ) {
        const origin = req.headers.origin;
        return this.authService.verifyEmail(verifyEmailDto, origin);
    }

    @Post('create-user')
    async createUser(
        @Body() createProfileDto: CreateProfileDto,
        @Res({ passthrough: true }) res: Response
    ) {
        return await this.authService.createUser(createProfileDto, res); //  access token
    }

    @Post('refresh')
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        console.log(req.cookies['refreshToken']);
        const token = req.cookies['refreshToken'];
        return await this.authService.refresh(token, res); //  access token
    }

    @Post('forgot-password')
    async forgotPassword(
        @Body() verifyEmailDto: VerifyEmailDto,
        @Req() req: Request
    ) {
        const origin = req.headers.origin;
        return this.authService.forgotPassword(verifyEmailDto, origin);
    }

    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return await this.authService.resetPassword(resetPasswordDto);
    }

    @Post('logout')
    @UseGuards(AuthGuard)
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        return await this.authService.logout(req, res); // true if successfully logged out
    }

    @Get('home')
    @UseGuards(AuthGuard)
    async home(@Req() req) {
        return req.user;
    }
}
