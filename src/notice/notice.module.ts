import { Module } from '@nestjs/common';
import { NoticeController } from './notice.controller';
import { AuthModule } from 'src/auth/auth.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeEntity } from './entities/notice.entity';
import { NoticeService } from './notice.service';


@Module({  
  imports: [
  TypeOrmModule.forFeature([NoticeEntity]),
  AuthModule,
  RedisModule
],
  controllers: [NoticeController],
  providers: [NoticeService]
})
export class NoticeModule {}


