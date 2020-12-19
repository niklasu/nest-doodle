import { AnswerEnum } from './submitAnswer';

class Answer {
  participantId: number;
  answer: AnswerEnum;
}

export class Appointment {
  id: number;
  name: string;
  participants: number[];
  answers: Answer[] = [];

  constructor(id: number, value: string, participants: number[]) {
    this.name = value;
    this.id = id;
    this.participants = participants;
  }
}
