import {
    Column,
    Unique,
    Model,
    Table,
    AllowNull,
    PrimaryKey,
    DataType,
    Default
} from 'sequelize-typescript';

@Table({
    tableName: 'Users',
})
export class UserModel extends Model<UserModel> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id:string;


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

    @Column
    role: string;

    @Column
    refreshToken: string;
}