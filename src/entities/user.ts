import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsString } from 'class-validator';

@Entity('user')
export class User extends BaseEntity {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  @IsString()
  firstName: string;

  @Column('varchar')
  lastName: string;

  @Column('date')
  birthdate: string;

  @Column('integer')
  prefixPhone?: number;

  @Column('integer')
  phone?: number;

  @Column('varchar')
  password: string;

  @Column('boolean')
  activated: boolean;

  @Column('varchar')
  email: string;

  @Column('uuid')
  activationCode?: string;

}
