import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentService } from './appointment.service';
import { UsersController } from './users/users.controller';

@Module({
  imports: [],
  controllers: [AppointmentsController, UsersController],
  providers: [AppointmentService],
})
export class AppModule {}
