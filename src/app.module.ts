import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppointmentService } from './appointment.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppointmentService],
})
export class AppModule {}
