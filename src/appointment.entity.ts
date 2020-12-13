export class Appointment {
  id: number;
  name: string;
  participants: number[];

  constructor(id: number, value: string, participants: number[]) {
    this.name = value;
    this.id = id;
    this.participants = participants;
  }
}
