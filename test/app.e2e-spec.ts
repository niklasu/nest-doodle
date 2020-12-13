import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Appointment } from '../src/appointment.entity';
import { AppointmentService } from '../src/appointment.service';
import { CreateAppointment } from '../src/appointment.request';

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

  afterAll(async () => {
    await app.close();
  });
});
