import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AppointmentService } from '../appointment.service';
import { Appointment } from '../appointment.entity';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get(':id/invites')
  getByUserId(@Param('id', ParseIntPipe) id: number): Array<Appointment> {
    return this.appointmentService.getUserById(id);
  }
}
