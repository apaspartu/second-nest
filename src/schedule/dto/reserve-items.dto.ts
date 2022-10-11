import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReserveItemsDto {
    @ApiProperty()
    @IsNotEmpty()
    firstItemId: string;

    @ApiProperty()
    @IsNotEmpty()
    lastItemId: string;
}
