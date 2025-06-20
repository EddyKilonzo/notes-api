export interface User {
  id: number;
  email: string;
  name: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}
