import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  like(): string {
    return 'diste un like';
  }
}
