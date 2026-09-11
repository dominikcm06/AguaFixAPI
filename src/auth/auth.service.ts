import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';

type SafeUser = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(dto: CreateUserDto): Promise<SafeUser> {
    const user = await this.usersService.create(dto);
    return this.toSafeUser(user);
  }

  async login(dto: LoginDto): Promise<SafeUser> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new BadRequestException('Credenciales invalidas');
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);
    if (!isValidPassword) {
      throw new BadRequestException('Credenciales invalidas');
    }

    return this.toSafeUser(user);
  }

  private toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isNotificationEnabled: user.isNotificationEnabled,
    };
  }
}
