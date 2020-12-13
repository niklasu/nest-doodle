import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AppointmentService } from '../appointment.service';
import { Appointment } from '../appointment.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get(':id')
  getByUserId(@Param('id', ParseIntPipe) id: number): Array<Appointment> {
    return this.appointmentService.getUserById(id);
  }
}
