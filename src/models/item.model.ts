import {
    Column,
    Model,
    Table,
    AllowNull,
    PrimaryKey,
    DataType,
    Default,
} from 'sequelize-typescript';

@Table({
    tableName: 'Items',
})
export class ItemModel extends Model {
    @PrimaryKey
    @Column
    id: string;

    @AllowNull(false)
    @Column(DataType.UUID)
    eventId: string;
}
