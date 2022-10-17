import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthHTTPGuard } from '../auth/authHTTP.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserModel } from '../models';
import { UpdatePasswordDto } from './dto/update-password.dto';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @ApiResponse({ type: UserModel })
    @ApiBearerAuth()
    @UseGuards(AuthHTTPGuard)
    @Get()
    async getProfile(@Req() req): Promise<UserModel> {
        console.log('nice');
        return this.profileService.getProfile(req.user.id);
    }

    @ApiResponse({ description: 'boolean' })
    @ApiBearerAuth()
    @UseGuards(AuthHTTPGuard)
    @Patch('update')
    async updateProfile(
        @Body() dto: UpdateProfileDto,
        @Req() req
    ): Promise<boolean> {
        return await this.profileService.updateProfile(req.user.email, dto);
    }

    @ApiResponse({ description: 'boolean' })
    @ApiBearerAuth()
    @UseGuards(AuthHTTPGuard)
    @Patch('change-password')
    async updatePassword(
        @Body() dto: UpdatePasswordDto,
        @Req() req
    ): Promise<boolean> {
        return await this.profileService.updatePassword(req.user.email, dto);
    }
}
