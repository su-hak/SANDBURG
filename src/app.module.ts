import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis'

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BoardsModule } from './boards/boards.module';
import { NoticeModule } from './notice/notice.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [`${__dirname}/**/*.entity.{ts,js}`],
      synchronize: Boolean(process.env.DB_SYNC),
    }),

    RedisModule.forRoot({
      closeClient: true,
      config: {
        host: 'localhost',
        port: 6379,
      },
    }),

    AuthModule,
    UserModule, 
    BoardsModule, NoticeModule, AdminModule,
  ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
