import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Worldomate tomate mit erdbeeren!';
  }
}
