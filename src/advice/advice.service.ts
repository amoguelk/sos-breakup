import { Injectable } from '@nestjs/common';

@Injectable()
export class AdviceService {
  findAll() {
    return 'This returns all saved advice';
  }
}
