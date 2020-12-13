import { Injectable } from '@nestjs/common';
import { Appointment } from './appointment.entity';
import { CreateAppointment } from './appointment.request';

@Injectable()
export class AppointmentService {
  appointments: Array<Appointment> = new Array<Appointment>();

  getAll(): Array<Appointment> {
    return this.appointments;
  }

  create(request: CreateAppointment) {
    const appointment = new Appointment(
      AppointmentService.getId(),
      request.name,
      request.participants,
    );
    this.appointments.push(appointment);
    return appointment;
  }

  private static getId() {
    return Math.floor(Math.random() * (999 + 1));
  }
}
