import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppointmentService } from './appointment.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppointmentService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getAll()).toBe('Hello World!');
    });
  });
});
