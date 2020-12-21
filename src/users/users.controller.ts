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

  @Get(':id/invites')
  getByUserId(@Param('id', ParseIntPipe) id: number): Array<Appointment> {
    return this.appointmentService.getUserById(id);
  }

  @Post()
  createUser(@Body() request: CreateUserRequest): User {
    return this.appointmentService.createUser(request);
  }
}
