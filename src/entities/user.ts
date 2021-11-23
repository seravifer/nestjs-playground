import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  birthdate?: string;
  prefixPhone?: number;
  phone?: number;
  email: string;
}

@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar")
  firstName!: string;

  @Column("varchar")
  lastName!: string;

  @Column("date")
  birthdate!: string;

  @Column("integer")
  prefixPhone?: number;

  @Column("integer")
  phone?: number;

  @Column("varchar")
  password!: string;

  @Column("boolean")
  activated!: boolean;

  @Column("varchar")
  email!: string;

  @Column("uuid")
  activationCode?: string;
}
