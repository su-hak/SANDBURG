import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';

import { AuthDTO } from 'src/auth/dto/authDto'

import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRedis() private readonly redis: Redis,
    private readonly jwtService: JwtService,
  ) { }

  async create(authDTO: AuthDTO.SignUp) {
    const userEntity = this.userRepository.create(authDTO);
    return await this.userRepository.save(userEntity);
  }

  async findById(id: number) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findByNickname(nickname: string) {
    return await this.userRepository.findOne({
      where: {
        nickname,
      },
    });
  }

  async delete(user: UserEntity): Promise<void> {
    await this.userRepository.remove(user);
  }

  async logout(token: string): Promise<void> {
    const decodedToken = this.jwtService.decode(token) as any;
    const exp = decodedToken.exp;
    const currentTime = Math.floor(Date.now() / 1000);

    if (exp > currentTime) {
      const ttl = exp - currentTime;
      await this.redis.set(token, 'blacklist', 'EX', ttl);
    }
  }

  async update(userId: number, updateUser: AuthDTO.UpdateUser): Promise<UserEntity> {
    if ('email' in updateUser) {
      throw new BadRequestException('이메일은 수정할 수 없습니다.')
    }
    await this.userRepository.update(userId, updateUser);
    return this.userRepository.findOne({ where: { id: userId } })
  }
}
