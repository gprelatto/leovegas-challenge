import { User } from '../../entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UpdateUserActionDTO } from './user.dto';
import { CreateUserDTO } from '../auth/auth.dto';

@Injectable()
export class UsersService {
  constructor(private readonly dataSource: DataSource) {}

  private userRepository = this.dataSource.getRepository(User);

  async createUser(userDetails: CreateUserDTO) {
    const user = this.userRepository.create({ ...userDetails });
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'role', 'email', 'password'],
    });
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[] | null> {
    return this.userRepository.find();
  }

  async update(id: string, userData: UpdateUserActionDTO): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new HttpException('User not found.', HttpStatus.NOT_FOUND);

    if (userData.email) {
      const duplicatedEmail = await this.userRepository.findOne({ where: { email: userData.email } });
      if (duplicatedEmail) throw new HttpException('User with this email already exists.', HttpStatus.CONFLICT);
      user.email = userData.email;
    }

    user.name = userData.name;
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    user.isActive = false;
    return this.userRepository.softRemove(user);
  }
}
