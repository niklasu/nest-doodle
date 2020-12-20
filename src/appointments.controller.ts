import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from './appointment.entity';
import { CreateAppointment } from './appointment.request';
import { SubmitAnswer } from './submitAnswer';

@Controller('/api/appointments')
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  getAll(): Array<Appointment> {
    return this.appointmentService.getAll();
  }

  @Post()
  create(@Body() request: CreateAppointment): Appointment {
    return this.appointmentService.create(request);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) appointmentId: number) {
    return this.appointmentService.delete(appointmentId);
  }

  @Post(':id/answers')
  answer(
    @Body() request: SubmitAnswer,
    @Param('id', ParseIntPipe) appointmentId: number,
  ) {
    this.appointmentService.answer(appointmentId, request);
  }
}
