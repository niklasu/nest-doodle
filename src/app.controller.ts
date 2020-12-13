import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from './appointment.entity';
import { CreateAppointment } from './appointment.request';

@Controller()
export class AppController {
  constructor(private readonly appService: AppointmentService) {}

  @Get()
  getAll(): Array<Appointment> {
    return this.appService.getAll();
  }

  @Post()
  create(@Body() request: CreateAppointment): Appointment {
    return this.appService.create(request);
  }
}
