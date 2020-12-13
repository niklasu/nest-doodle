import { IsNotEmpty } from 'class-validator';

export class CreateAppointment {
  @IsNotEmpty()
  name: string;
}
