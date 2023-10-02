import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'email', type: 'varchar' })
  email: string;

  @Column({ name: 'password', type: 'varchar' })
  password: string;

  @Column({ name: 'password_conformition', type: 'varchar' })
  passwordConformition: string;

  @Column({ name: 'user_activation', type: 'boolean', default: false })
  userActivation: string;

  @Column({ name: 'user_name', type: 'varchar' })
  userName: string;

  @Column({ name: 'user_surname', type: 'varchar' })
  userSurname: string;

  @Column({ name: 'user_avatar', type: 'varchar' })
  userAvatar: string;

  @Column({ name: 'token_refresh', type: 'varchar' })
  tokenRefresh: string;
}
