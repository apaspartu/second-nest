import {
    Column,
    Model,
    Table,
    AllowNull,
    PrimaryKey,
    DataType,
    Default,
    HasOne,
    HasMany,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { UserModel } from './user.model';
import { ItemModel } from './item.model';

@Table({
    tableName: 'Events',
})
export class EventModel extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;

    @AllowNull(false)
    @Column(DataType.UUID)
    @ForeignKey(() => UserModel)
    userId: string;

    @Default(false)
    @AllowNull(false)
    @Column
    isCompleted: boolean;

    @Column
    title: string;

    @Column(DataType.TEXT)
    description: string;

    @Column
    color: string;

    @HasMany(() => ItemModel)
    items: ItemModel[];

    @BelongsTo(() => UserModel)
    user: UserModel;
}
