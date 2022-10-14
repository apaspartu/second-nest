import {
    Column,
    Model,
    Table,
    AllowNull,
    PrimaryKey,
    DataType,
    Default,
    BelongsTo,
    ForeignKey,
} from 'sequelize-typescript';
import { EventModel } from './event.model';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

@Table({
    tableName: 'Items',
})
export class ItemModel extends Model {
    @ApiModelProperty()
    @PrimaryKey
    @Column
    id: string;

    @ApiModelProperty()
    @AllowNull(false)
    @Column(DataType.UUID)
    @ForeignKey(() => EventModel)
    eventId: string;

    @ApiModelProperty()
    @BelongsTo(() => EventModel)
    event: EventModel;
}
