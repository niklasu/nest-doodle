export class SubmitAnswer {
  appointmentId: number;
  participantId: number;
  answer: AnswerEnum;
}

export enum AnswerEnum {
  ACCEPTED,
  REJECTED,
}
