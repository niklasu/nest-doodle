import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class CreateAppointment {
  @IsNotEmpty()
  name: string;

  @ArrayNotEmpty()
  participants: number[];
}
