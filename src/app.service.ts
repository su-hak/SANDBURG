import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `<a href="/api-docs">swagger ui로 이동</a>`;
  }
}
