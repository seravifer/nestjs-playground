import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('user')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    birthdate: string;

    @Column()
    phone: number;

    @Column()
    password: string;

    @Column()
    email: string;

}
