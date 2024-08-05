import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    AuthModule,
    RedisModule
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}

