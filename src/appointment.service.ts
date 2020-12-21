import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Appointment, StateEnum } from './appointment.entity';
import { CreateAppointment } from './appointment.request';
import { SubmitAnswer } from './submitAnswer';
import { User } from './user';
import { CreateUserRequest } from './createUserRequest';
import { AnswerEnum } from './AnswerEnum';

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

  getInvitesForUser(id: number) {
    return this.appointments.filter((a) => a.participants.includes(id));
  }

  answer(id: number, request: SubmitAnswer) {
    const appointmentsWithId = this.appointments.filter((a) => a.id == id);
    if (appointmentsWithId.length == 0) {
      throw new BadRequestException();
    }
    const app = appointmentsWithId[0];

    const answers = app.answers;
    const givenAnswerForUser = answers.filter(
      (a) => a.participantId == request.participantId,
    );
    if (givenAnswerForUser.length == 0) {
      answers.push({
        participantId: request.participantId,
        answer: request.answer,
      });
    } else {
      givenAnswerForUser[0].answer = request.answer;
    }

    const oneIsRejected: boolean =
      answers.filter((a) => a.answer == AnswerEnum.REJECTED).length > 0;
    if (oneIsRejected) {
      app.state = StateEnum.CALLED_OFF;
    } else {
      if (answers.length === app.participants.length) {
        app.state = StateEnum.CONFIRMED;
      } else {
        app.state = StateEnum.PENDING;
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

  getAllUsers() {
    return this.users;
  }

  getUser(id: number) {
    const user = this.users.filter((u) => u.id === id);
    if (user.length != 1) {
      throw new NotFoundException();
    }
    return user[0];
  }
}
