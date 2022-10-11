import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
    @ApiProperty()
    @IsNotEmpty()
    eventId: string;

    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    author: string;

    @ApiProperty()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    color: string;

    @ApiProperty()
    @IsNotEmpty()
    firstItemId: string;

    @ApiProperty()
    @IsNotEmpty()
    lastItemId: string;
}
