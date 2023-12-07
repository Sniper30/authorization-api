import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// export class UserLoginDTO {
//   @IsNumberString()
//   id: number;
// }

export class UserLoginDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
