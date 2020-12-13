export class Appointment {
  id: number;
  name: string;

  constructor(id: number, value: string) {
    this.name = value;
    this.id = id;
  }
}
