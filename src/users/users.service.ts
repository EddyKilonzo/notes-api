import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './interface/user.interface';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const { email, password, name } = createUserDto;

    // Check if user already exists
    const existingUser = await this.databaseService.query(
      'SELECT id FROM users WHERE email = $1',
      [email],
    );

    if (existingUser.length > 0) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await this.databaseService.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at, updated_at',
      [email, hashedPassword, name],
    );

    return result[0];
  }

  async validateUser(
    loginUserDto: LoginUserDto,
  ): Promise<Omit<User, 'password'>> {
    const { email, password } = loginUserDto;

    const result = await this.databaseService.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );

    if (result.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = result[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findById(id: number): Promise<Omit<User, 'password'> | null> {
    const result = await this.databaseService.query(
      'SELECT id, email, name, created_at, updated_at FROM users WHERE id = $1',
      [id],
    );

    return result.length > 0 ? result[0] : null;
  }
}
