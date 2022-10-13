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

@Table({
    tableName: 'Items',
})
export class ItemModel extends Model {
    @PrimaryKey
    @Column
    id: string;

    @AllowNull(false)
    @Column(DataType.UUID)
    @ForeignKey(() => EventModel)
    eventId: string;

    @BelongsTo(() => EventModel)
    event: EventModel;
}
