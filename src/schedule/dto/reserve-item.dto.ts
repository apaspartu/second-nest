import {
    Validate,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import * as dayjs from 'dayjs';

@ValidatorConstraint({ name: 'ItemId', async: false })
export class IsItemId implements ValidatorConstraintInterface {
    validate(itemId: string, args: ValidationArguments) {
        return this.validateItemId(itemId);
    }

    defaultMessage(args: ValidationArguments) {
        return 'Invalid item id';
    }

    validateItemId(itemId) {
        return dayjs(itemId, 'YYYY-MM-DD/HH:mm', true).isValid();
    }
}

export class ReserveItemDto {
    @ApiProperty()
    @Validate(IsItemId)
    itemId: string;
}
