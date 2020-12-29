import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentService } from './appointment.service';
import { UsersController } from './users/users.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AppointmentsController, UsersController, AppController],
  providers: [AppointmentService],
})
export class AppModule {}
