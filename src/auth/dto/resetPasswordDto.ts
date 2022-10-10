import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    resetToken: string;

    @ApiProperty()
    @IsNotEmpty()
    newPassword: string;
}
