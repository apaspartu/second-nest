import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Req,
    Res,
    ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { CreateProfileDto } from './dto/createProfile.dto';
import { AuthHTTPGuard } from './authHTTP.guard';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { Request, Response } from 'express';
import { ResetPasswordDto } from './dto/resetPasswordDto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenInterface, UserInterface } from '../interfaces';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiResponse({ type: AccessTokenInterface })
    @Post('sign-in')
    async signIn(
        @Body() loginUserDto: LoginUserDto,
        @Res({ passthrough: true }) res: Response
    ): Promise<AccessTokenInterface> {
        return await this.authService.signIn(loginUserDto, res); //  access token
    }

    @ApiResponse({ description: 'boolean' })
    @Post('verify-email')
    async verifyEmail(
        @Body() verifyEmailDto: VerifyEmailDto,
        @Req() req: Request
    ): Promise<boolean> {
        const origin = req.headers.origin;
        return this.authService.verifyEmail(verifyEmailDto, origin);
    }

    @ApiResponse({ type: AccessTokenInterface })
    @Post('create-user')
    async createUser(
        @Body() createProfileDto: CreateProfileDto,
        @Res({ passthrough: true }) res: Response
    ): Promise<AccessTokenInterface> {
        return await this.authService.createUser(createProfileDto, res); //  access token
    }

    @ApiResponse({ type: AccessTokenInterface })
    @Post('refresh')
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ): Promise<AccessTokenInterface> {
        console.log(req.cookies['refreshToken']);
        const token = req.cookies['refreshToken'];
        return await this.authService.refresh(token, res); //  access token
    }

    @ApiResponse({ description: 'boolean' })
    @Post('forgot-password')
    async forgotPassword(
        @Body() verifyEmailDto: VerifyEmailDto,
        @Req() req: Request
    ): Promise<boolean> {
        const origin = req.headers.origin;
        return this.authService.forgotPassword(verifyEmailDto, origin);
    }

    @ApiResponse({ description: 'boolean' })
    @Post('reset-password')
    async resetPassword(
        @Body() resetPasswordDto: ResetPasswordDto
    ): Promise<boolean> {
        return await this.authService.resetPassword(resetPasswordDto);
    }

    @ApiResponse({ description: 'boolean' })
    @ApiBearerAuth()
    @Post('logout')
    @UseGuards(AuthHTTPGuard)
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ): Promise<boolean> {
        return await this.authService.logout(req, res); // true if successfully logged out
    }
}
