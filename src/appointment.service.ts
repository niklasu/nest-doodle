import { BadRequestException, Injectable } from '@nestjs/common';
import { Appointment } from './appointment.entity';
import { CreateAppointment } from './appointment.request';
import { SubmitAnswer } from './submitAnswer';

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

  getUserById(id: number) {
    return this.appointments.filter((a) => a.participants.includes(id));
  }

  answer(request: SubmitAnswer) {
    const appointmentsWithId = this.appointments.filter(
      (a) => a.id == request.appointmentId,
    );
    if (appointmentsWithId.length == 0) {
      throw new BadRequestException();
    }
    const app = appointmentsWithId[0];
    app.answers.push({ participantId: request.participantId });
  }
}
