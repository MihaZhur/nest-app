import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './types';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'email', type: 'varchar' })
  email: string;

  @Column({ name: 'password', type: 'varchar' })
  password: string;

  @Column({ name: 'user_name', type: 'varchar', nullable: true })
  userName: string;

  @Column({ name: 'user_surname', type: 'varchar', nullable: true })
  userSurname: string;

  @Column({ name: 'role', type: 'varchar', default: Role.user })
  role: string;

  @Column({ name: 'user_avatar', type: 'varchar', nullable: true })
  userAvatar: string;

  @Column({
    name: 'email_confirmation_token',
    type: 'varchar',
    nullable: true,
  })
  emailConformitionToken: string;

  @Column({
    name: 'user_active',
    type: 'boolean',
    nullable: true,
    default: false,
  })
  userActive: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
