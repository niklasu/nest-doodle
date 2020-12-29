import { Body, Injectable } from '@nestjs/common';
import { CreateUserRequest } from '../createUserRequest';
import { AppointmentService } from '../appointment.service';
import { User } from '../user';

@Injectable()
export class UsersService {
  users: Array<User> = new Array<User>();

  create(request: CreateUserRequest): User {
    const newUser = { id: AppointmentService.getId(), ...request };
    this.users.push(newUser);
    return newUser;
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.name === username);
  }
}
