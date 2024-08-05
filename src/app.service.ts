import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    <body style="display: flex; align-items: center; flex-direction: row; justify-content: center;">
    <a href="/api-docs" style="font-size: 40px; color: black; font-weight: 900;">swagger ui로 이동</a>
    </body>
    `;
  }
}
