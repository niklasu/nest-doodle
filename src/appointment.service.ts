import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Appointment, StateEnum } from './appointment.entity';
import { CreateAppointment } from './appointment.request';
import { AnswerEnum, SubmitAnswer } from './submitAnswer';
import { User } from './user';
import { CreateUserRequest } from './createUserRequest';

@Injectable()
export class AppointmentService {
  appointments: Array<Appointment> = new Array<Appointment>();
  users: Array<User> = new Array<User>();

  getAll(): Array<Appointment> {
    return this.appointments;
  }

  create(request: CreateAppointment) {
    this.usersAreKnown(request.participants);
    const appointment = new Appointment(
      AppointmentService.getId(),
      request.name,
      request.participants,
    );
    this.appointments.push(appointment);
    return appointment;
  }

  private usersAreKnown(participants: number[]): boolean {
    participants.forEach((p) => {
      if (!this.users.map((u) => u.id).includes(p)) {
        throw new NotFoundException();
      }
    });
    return true;
  }

  private static getId() {
    return Math.floor(Math.random() * (999 + 1));
  }

  getUserById(id: number) {
    return this.appointments.filter((a) => a.participants.includes(id));
  }

  answer(id: number, request: SubmitAnswer) {
    const appointmentsWithId = this.appointments.filter((a) => a.id == id);
    if (appointmentsWithId.length == 0) {
      throw new BadRequestException();
    }
    const app = appointmentsWithId[0];

    app.answers.push({
      participantId: request.participantId,
      answer: request.answer,
    });

    if (app.answers.length === app.participants.length) {
      const oneIsRejected: boolean =
        app.answers.filter((a) => a.answer === AnswerEnum.REJECTED).length > 0;
      if (oneIsRejected) {
        app.state = StateEnum.CALLED_OFF;
      } else {
        app.state = StateEnum.CONFIRMED;
      }
    }
  }

  delete(appointmentId: number) {
    this.appointments = this.appointments.filter((a) => a.id != appointmentId);
  }

  createUser(request: CreateUserRequest) {
    const newUser = { id: AppointmentService.getId(), ...request };
    this.users.push(newUser);
    return newUser;
  }
}
