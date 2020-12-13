import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppointmentService } from './appointment.service';
import { UsersController } from './users/users.controller';

@Module({
  imports: [],
  controllers: [AppController, UsersController],
  providers: [AppointmentService],
})
export class AppModule {}
