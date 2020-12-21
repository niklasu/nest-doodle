import { AnswerEnum } from './AnswerEnum';

class Answer {
  participantId: number;
  answer: AnswerEnum;
}

export class Appointment {
  id: number;
  name: string;
  participants: number[];
  answers: Answer[] = [];
  state: StateEnum = StateEnum.PENDING;

  constructor(id: number, value: string, participants: number[]) {
    this.name = value;
    this.id = id;
    this.participants = participants;
  }
}

export enum StateEnum {
  PENDING,
  CALLED_OFF,
  CONFIRMED,
}
