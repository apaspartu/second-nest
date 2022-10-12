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
    tableName: 'Events',
})
export class EventModel extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;

    @AllowNull(false)
    @Column(DataType.UUID)
    userId: string;

    @Default(false)
    @AllowNull(false)
    @Column
    isCompleted: boolean;

    @Column
    title: string;

    @Column
    author: string;

    @Column
    email: string;

    @Column(DataType.TEXT)
    description: string;

    @Column
    color: string;
}
