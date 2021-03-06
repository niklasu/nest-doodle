import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AppointmentService } from '../src/appointment.service';
import { StateEnum } from '../src/appointment.entity';
import { AnswerEnum } from '../src/AnswerEnum';
import { UsersService } from '../src/users/users.service';

describe('AppointmentsController (e2e)', () => {
  let app: INestApplication;
  let authHeaders = {};
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    const userService = app.get(UsersService);
    userService.create({ name: 'john', password: 'changeme' });

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'john',
        password: 'changeme',
      })
      .then((res) => {
        authHeaders = { Authorization: `Bearer ${res.body.access_token}` };
      });
  });

  function createUsers(appointmentService: AppointmentService): Array<number> {
    return [
      appointmentService.createUser({ name: 'fred', password: '1' }).id,
      appointmentService.createUser({ name: 'fred2', password: '2' }).id,
      appointmentService.createUser({ name: 'fred3', password: '3' }).id,
    ];
  }

  it('Get all appointments', async () => {
    const appointmentService = app.get(AppointmentService);
    const createdUserIds = createUsers(appointmentService);
    appointmentService.create({
      participants: createdUserIds,
      name: 'meet in the park',
    });

    appointmentService.create({
      participants: createdUserIds,
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
    const users = createUsers(appointmentService);
    const { id } = appointmentService.create({
      participants: users,
      name: 'meet in the park',
    });

    await request(app.getHttpServer())
      .delete(`/api/appointments/${id}`)
      .set(authHeaders);

    expect(appointmentService.getAll().length).toBe(0);
  });

  it('submit for appointment that does not exist', () => {
    return request(app.getHttpServer())
      .post('/api/appointments/33/answers')
      .set(authHeaders)
      .expect(400);
  });

  it('submit for appointment', async () => {
    const appointmentService = app.get(AppointmentService);
    const users = createUsers(appointmentService);
    const { id } = appointmentService.create({
      participants: users,
      name: 'meet in the cinema',
    });

    await request(app.getHttpServer())
      .post(`/api/appointments/${id}/answers`)
      .send({
        participantId: 42,
        answer: AnswerEnum.ACCEPTED,
      })
      .set(authHeaders);

    expect(appointmentService.getAll()[0].answers.length).toBe(1);
    const createdAnswer = appointmentService.getAll()[0].answers[0];
    expect(createdAnswer).toEqual({
      participantId: 42,
      answer: AnswerEnum.ACCEPTED,
    });
  });

  it('appointment state is accepted', async () => {
    const appointmentService = app.get(AppointmentService);
    const users = createUsers(appointmentService).slice(0, 2);
    const { id } = appointmentService.create({
      participants: users,
      name: 'meet in the cinema',
    });

    for (const i of users) {
      await request(app.getHttpServer())
        .post(`/api/appointments/${id}/answers`)
        .send({
          participantId: i,
          answer: AnswerEnum.ACCEPTED,
        })
        .set(authHeaders);
    }

    const appointment = appointmentService.getAll()[0];
    expect(appointment.answers.length).toBe(2);
    expect(appointment).toMatchObject({
      name: 'meet in the cinema',
      participants: users,
      state: StateEnum.CONFIRMED,
    });
  });

  it('appointment state is rejected', async () => {
    const appointmentService = app.get(AppointmentService);
    const users = createUsers(appointmentService).slice(0, 2);
    const { id } = appointmentService.create({
      participants: users,
      name: 'meet in the cinema',
    });

    await request(app.getHttpServer())
      .post(`/api/appointments/${id}/answers`)
      .send({
        participantId: users[0],
        answer: AnswerEnum.ACCEPTED,
      })
      .set(authHeaders);

    await request(app.getHttpServer())
      .post(`/api/appointments/${id}/answers`)
      .send({
        participantId: users[1],
        answer: AnswerEnum.REJECTED,
      })
      .set(authHeaders);

    const appointment = appointmentService.getAll()[0];
    expect(appointment.answers.length).toBe(2);
    expect(appointment).toMatchObject({
      name: 'meet in the cinema',
      participants: users,
      state: StateEnum.CALLED_OFF,
    });
  });

  it('appointment state switches from accepted to rejected', async () => {
    const appointmentService = app.get(AppointmentService);
    const users = createUsers(appointmentService).slice(0, 2);
    const { id } = appointmentService.create({
      participants: users,
      name: 'meet in the cinema',
    });

    for (const i of users) {
      await request(app.getHttpServer())
        .post(`/api/appointments/${id}/answers`)
        .send({
          participantId: i,
          answer: AnswerEnum.ACCEPTED,
        })
        .set(authHeaders);
    }

    let appointment = appointmentService.getAll()[0];
    expect(appointment.answers.length).toBe(2);
    expect(appointment).toMatchObject({
      name: 'meet in the cinema',
      participants: users,
      state: StateEnum.CONFIRMED,
    });

    await request(app.getHttpServer())
      .post(`/api/appointments/${id}/answers`)
      .send({
        participantId: users[0],
        answer: AnswerEnum.REJECTED,
      })
      .set(authHeaders);;

    appointment = appointmentService.getAll()[0];
    expect(appointment.answers.length).toBe(2);
    expect(appointment).toMatchObject({
      name: 'meet in the cinema',
      participants: users,
      state: StateEnum.CALLED_OFF,
    });
  });

  it('get appointment invitations for user', () => {
    const appointmentService = app.get(AppointmentService);
    const users = createUsers(appointmentService);
    const { id: firstAppointmentId } = appointmentService.create({
      participants: users,
      name: 'meet in the cinema',
    });
    const { id: secondAppointmentId } = appointmentService.create({
      participants: users,
      name: 'meet in the park',
    });
    appointmentService.create({
      participants: users.slice(2, 3),
      name: 'meet in the store',
    });

    return request(app.getHttpServer())
      .get(`/api/users/${users[0]}/invites`)
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
    const appointmentService = app.get(AppointmentService);
    const users = createUsers(appointmentService);

    await request(app.getHttpServer())
      .post('/api/appointments')
      .set(authHeaders)
      .send({ name: 'meet in the park', participants: users })
      .expect(201);

    expect(appointmentService.getAll()[0].name).toBe('meet in the park');
    expect(appointmentService.getAll()[0].state).toBe(StateEnum.PENDING);
  });

  it('create appointment for a user that does not exist', async () => {
    return request(app.getHttpServer())
      .post('/api/appointments')
      .set(authHeaders)
      .send({ name: 'meet in the park', participants: [1] })
      .expect(404);
  });

  it('create user', async () => {
    const userService = app.get(UsersService);
    await request(app.getHttpServer())
      .post('/api/users')
      .send({ name: 'fred', password: '123' })
      .expect(201);

    expect(await userService.findOne('fred')).toMatchObject({
      name: 'fred',
      password: '123',
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
