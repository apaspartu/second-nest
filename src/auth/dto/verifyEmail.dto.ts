import {
    IsEmail,
    Validate,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { toLowerCase } from '../../lib/helpers';

@ValidatorConstraint({ name: 'CompanyEmail', async: false })
export class CompanyEmail implements ValidatorConstraintInterface {
    validate(email: string, args: ValidationArguments) {
        return email.endsWith('@fivesysdev.com');
    }

    defaultMessage(args: ValidationArguments) {
        return 'Allowed only for @fivesysdev.com email adresses!';
    }
}

export class VerifyEmailDto {
    @ApiProperty()
    @Validate(CompanyEmail)
    @IsEmail()
    @Transform(toLowerCase)
    email: string;
}
