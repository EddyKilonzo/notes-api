import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    const token = this.generateToken(user);

    return {
      user,
      token,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.validateUser(loginUserDto);
    const token = this.generateToken(user);

    return {
      user,
      token,
    };
  }

  private generateToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
