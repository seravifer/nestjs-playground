import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

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
