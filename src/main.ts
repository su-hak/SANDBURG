import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
  .setTitle('김수학의 API 서버')
  .setDescription('김수학의 nest.js x swagger 이용한 API 서버 테스트입니다.')
  .setVersion('1.0')
  .addBearerAuth() // JWT 인증 추가
  .addServer('http://localhost:3000')
  .addTag('API 서버 만들기')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://poshmale.co.kr', 'http://www.poshmale.co.kr'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
