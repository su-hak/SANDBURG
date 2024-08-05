import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as fs from 'fs';
import * as path from 'path';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./poshmale.co.kr+1-key.pem'),
    cert: fs.readFileSync('./poshmale.co.kr+1.pem'),
  }

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

    // HTTP to HTTPS 리디렉션 미들웨어 추가
    // app.use((req: Request, res: Response, next: NextFunction) => {
    //   if (req.protocol === 'http') {
    //     res.redirect(301, `https://${req.headers.host}${req.url}`);
    //   } else {
    //     next();
    //   }
    // });
  
  const config = new DocumentBuilder()
  .setTitle('김수학의 API 서버')
  .setDescription('김수학의 nest.js x swagger 이용한 API 서버 테스트입니다.')
  .setVersion('1.0')
  .addBearerAuth() // JWT 인증 추가
  .addServer('https://poshmale.co.kr')
  .addTag('API 서버 만들기')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors({
    origin: ['https://localhost:3000','https://poshmale.co.kr', 'https://www.poshmale.co.kr', 'https://sandburg.iptime.org', 'https://www.sandburg.iptime.org'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
