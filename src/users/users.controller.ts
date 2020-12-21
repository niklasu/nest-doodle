import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AppointmentService } from '../appointment.service';
import { Appointment } from '../appointment.entity';
import { CreateUserRequest } from '../createUserRequest';
import { User } from '../user';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  getAll(): Array<User> {
    return this.appointmentService.getAllUsers();
  }

  @Get(':id')
  getByUserId(@Param('id', ParseIntPipe) id: number): User {
    return this.appointmentService.getUser(id);
  }

  @Get(':id/invites')
  getInvitesForUser(@Param('id', ParseIntPipe) id: number): Array<Appointment> {
    return this.appointmentService.getInvitesForUser(id);
  }

  @Post()
  createUser(@Body() request: CreateUserRequest): User {
    return this.appointmentService.createUser(request);
  }
}
