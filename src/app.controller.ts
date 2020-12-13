import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from './appointment.entity';
import { CreateAppointment } from './appointment.request';

@Controller('appointments')
export class AppController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  getAll(): Array<Appointment> {
    return this.appointmentService.getAll();
  }

  @Post()
  create(@Body() request: CreateAppointment): Appointment {
    return this.appointmentService.create(request);
  }
}
