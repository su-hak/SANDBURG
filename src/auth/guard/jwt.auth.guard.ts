import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('로그인 후 이용하세요.');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('토큰이 존재하지 않습니다.');
    }
    
    const isBlacklisted = await this.redis.get(token);

    if (isBlacklisted) {
      throw new UnauthorizedException('토큰이 블랙리스트에 있습니다.');
    }

    try {
      const user = this.jwtService.verify(token);
      request.user = user;
    } catch (err) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    const canActivate = await super.canActivate(context) as boolean;
    if (!canActivate) {
      return false;
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const user = request.user;
    return roles.includes(user.role);
    // return super.canActivate(context) as Promise<boolean>;
  }
}
