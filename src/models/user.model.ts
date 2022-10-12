import {
    Column,
    Unique,
    Model,
    Table,
    AllowNull,
    PrimaryKey,
    DataType,
    Default,
} from 'sequelize-typescript';

enum defaultValues {
    user = 'user',
}

@Table({
    tableName: 'Users',
})
export class UserModel extends Model<UserModel> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;

    @AllowNull(false)
    @Column
    name: string;

    @AllowNull(false)
    @Unique
    @Column
    email: string;

    @AllowNull(false)
    @Column
    password: string;

    @Default(defaultValues.user)
    @Column
    role: string;

    @Unique
    @Column
    sessionId: string;
}
