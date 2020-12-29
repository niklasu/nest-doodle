import { IsNotEmpty } from 'class-validator';

export class CreateUserRequest {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;
}
