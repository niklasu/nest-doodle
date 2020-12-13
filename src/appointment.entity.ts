export class Appointment {
  private id: number;
  private name: string;
  private participants: number[];

  constructor(id: number, value: string, participants: number[]) {
    this.name = value;
    this.id = id;
    this.participants = participants;
  }
}
