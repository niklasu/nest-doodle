import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AppointmentService } from '../src/appointment.service';
import { AnswerEnum } from '../src/submitAnswer';
import { StateEnum } from '../src/appointment.entity';

describe('AppointmentsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Get all appointments', () => {
    const appointmentService = app.get(AppointmentService);
    appointmentService.create({
      participants: [1, 2, 3],
      name: 'meet in the park',
    });

    appointmentService.create({
      participants: [1, 2, 3],
      name: 'meet in the cinema',
    });

    return request(app.getHttpServer())
      .get('/api/appointments')
      .expect((res) => {
        expect(res.body).toHaveLength(2);
      });
  });

  it('delete an appointment', async () => {
    const appointmentService = app.get(AppointmentService);
    const { id } = appointmentService.create({
      participants: [1, 2, 3],
      name: 'meet in the park',
    });

    await request(app.getHttpServer()).delete(`/api/appointments/${id}`);

    expect(appointmentService.getAll().length).toBe(0);
  });

  it('submit for appointment that does not exist', () => {
    return request(app.getHttpServer())
      .post('/api/appointments/33/answers')
      .expect(400);
  });

  it('submit for appointment', async () => {
    const appointmentService = app.get(AppointmentService);
    const { id } = appointmentService.create({
      participants: [1, 2, 3],
      name: 'meet in the cinema',
    });

    await request(app.getHttpServer())
      .post(`/api/appointments/${id}/answers`)
      .send({
        participantId: 42,
        answer: AnswerEnum.ACCEPTED,
      });

    expect(appointmentService.getAll()[0].answers.length).toBe(1);
    const createdAnswer = appointmentService.getAll()[0].answers[0];
    expect(createdAnswer).toEqual({
      participantId: 42,
      answer: AnswerEnum.ACCEPTED,
    });
  });

  it('appointment state is accepted', async () => {
    const appointmentService = app.get(AppointmentService);
    const { id } = appointmentService.create({
      participants: [1, 2],
      name: 'meet in the cinema',
    });

    for (const i of [1, 2]) {
      await request(app.getHttpServer())
        .post(`/api/appointments/${id}/answers`)
        .send({
          participantId: i,
          answer: AnswerEnum.ACCEPTED,
        });
    }

    const appointment = appointmentService.getAll()[0];
    expect(appointment.answers.length).toBe(2);
    expect(appointment).toMatchObject({
      name: 'meet in the cinema',
      participants: [1, 2],
      state: StateEnum.CONFIRMED,
    });
  });

  it('appointment state is rejected', async () => {
    const appointmentService = app.get(AppointmentService);
    const { id } = appointmentService.create({
      participants: [1, 2],
      name: 'meet in the cinema',
    });

    await request(app.getHttpServer())
      .post(`/api/appointments/${id}/answers`)
      .send({
        participantId: 1,
        answer: AnswerEnum.ACCEPTED,
      });

    await request(app.getHttpServer())
      .post(`/api/appointments/${id}/answers`)
      .send({
        participantId: 2,
        answer: AnswerEnum.REJECTED,
      });

    const appointment = appointmentService.getAll()[0];
    expect(appointment.answers.length).toBe(2);
    expect(appointment).toMatchObject({
      name: 'meet in the cinema',
      participants: [1, 2],
      state: StateEnum.CALLED_OFF,
    });
  });

  it('get appointment invitations for user', () => {
    const appointmentService = app.get(AppointmentService);
    const { id: firstAppointmentId } = appointmentService.create({
      participants: [1, 2, 3],
      name: 'meet in the cinema',
    });
    const { id: secondAppointmentId } = appointmentService.create({
      participants: [1, 2, 3],
      name: 'meet in the park',
    });
    appointmentService.create({
      participants: [2, 3],
      name: 'meet in the store',
    });

    return request(app.getHttpServer())
      .get('/api/users/1/invites')
      .expect(200)
      .expect((res) => {
        const body = res.body;
        expect(body).toHaveLength(2);
        expect(body.map((e) => e.id)).toEqual([
          firstAppointmentId,
          secondAppointmentId,
        ]);
      });
  });

  it('create appointment', async () => {
    await request(app.getHttpServer())
      .post('/api/appointments')
      .send({ name: 'meet in the park', participants: [1, 2, 3] })
      .expect(201);

    const appointmentService = app.get(AppointmentService);
    expect(appointmentService.getAll()[0].name).toBe('meet in the park');
    expect(appointmentService.getAll()[0].state).toBe(StateEnum.PENDING);
  });

  afterAll(async () => {
    await app.close();
  });
});
