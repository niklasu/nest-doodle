import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AppointmentService } from '../src/appointment.service';

describe('AppController (e2e)', () => {
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
      .get('/appointments')
      .expect((res) => {
        expect(res.body).toHaveLength(2);
      });
  });

  it('submit for appointment that does not exist', () => {
    return request(app.getHttpServer())
      .post('/appointments/answers')
      .send({ appointmentId: 33 })
      .expect(400);
  });

  it('submit for appointment', async () => {
    const appointmentService = app.get(AppointmentService);
    const { id } = appointmentService.create({
      participants: [1, 2, 3],
      name: 'meet in the cinema',
    });

    await request(app.getHttpServer())
      .post('/appointments/answers')
      .send({ appointmentId: id });

    expect(appointmentService.getAll()[0].answers.length).toBe(1);
  });

  afterAll(async () => {
    await app.close();
  });
});
