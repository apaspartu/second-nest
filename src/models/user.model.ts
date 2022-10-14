import {
    Column,
    Unique,
    Model,
    Table,
    AllowNull,
    PrimaryKey,
    DataType,
    Default,
    HasMany,
} from 'sequelize-typescript';
import { EventModel } from './event.model';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

enum defaultValues {
    user = 'user',
}

@Table({
    tableName: 'Users',
})
export class UserModel extends Model<UserModel> {
    @ApiModelProperty()
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;

    @ApiModelProperty()
    @AllowNull(false)
    @Column
    name: string;

    @ApiModelProperty()
    @AllowNull(false)
    @Unique
    @Column
    email: string;

    @AllowNull(false)
    @Column
    password: string;

    @ApiModelProperty()
    @Default(defaultValues.user)
    @Column
    role: string;

    @Unique
    @Column
    sessionId: string;

    @HasMany(() => EventModel)
    events: EventModel[];
}
