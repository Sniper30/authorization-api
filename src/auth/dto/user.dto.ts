import { IsEmail, IsNotEmpty } from 'class-validator';

export class User {
  id: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password?: string;

  hash?: string;
  rt_hash?: string;

  @IsNotEmpty()
  name: string;
}
