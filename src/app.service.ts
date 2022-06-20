import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'THIS IS USING CLOUD FUNCTIONS!';
  }
}
