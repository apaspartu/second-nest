import {Column, Unique, Model, Table, AllowNull} from 'sequelize-typescript';

@Table({
    tableName: 'Users',
})
export class UserModel extends Model<UserModel> {
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