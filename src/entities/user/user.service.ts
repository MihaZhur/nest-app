import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { User } from './user.entity';
import { ValidateUserDto } from './dto/validateUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  availableFields = [
    'role',
    'userName',
    'email',
    'userSurname',
    'id',
    'password',
    'emailConformitionToken',
    'userActive',
  ];

  // Filter body's fileds from available fields list
  private filterFields(body: { [k: string]: any }) {
    const filteredBody: { [k: string]: any } = {};

    Object.keys(body).filter((k) => {
      if (this.availableFields.includes(k)) {
        filteredBody[k] = body[k];
      }
    });

    return filteredBody;
  }

  // Register new user
  public async createUser(userData: any) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: userData.email,
      },
    });
    if (existUser) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }
    const codeActivateUserEmail = uuidv4();

    const salt = await genSalt(10);

    const hashedPassword = await hash(userData.password, salt);

    const userNew: User = {
      ...userData,
      password: hashedPassword,
      emailConformitionToken: codeActivateUserEmail,
    };

    const usersAll = this.userRepository.create(userNew);
    await this.userRepository.save(usersAll);

    return usersAll;
  }

  // Get all users
  public async getAllUsers() {
    return await this.userRepository.find({
      select: this.availableFields as any,
    });
  }

  // Get user auth data by email
  public async getUserData(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: this.availableFields as any,
    });
  }

  // Get user data by id
  public async getUserDataById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      select: this.availableFields as any,
    });
  }

  // Update user data whole
  public async updateUserData(id: number, body: ValidateUserDto) {
    return await this.userRepository.update({ id }, this.filterFields(body));
  }

  public async findOneCodeActivate(emailConformitionToken: string) {
    return this.userRepository.findOne({
      where: { emailConformitionToken },
      select: this.availableFields as any,
    });
  }

  // Delete user by id
  public async deleteUser(id: number) {
    return await this.userRepository.delete(id);
  }
}
