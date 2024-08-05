import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { UserEntity } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
    constructor(private userService: UserService, 
        private configService: ConfigService
    ) {
        super({
            jwtFromRequest:
            ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET'),
        })
    }

    async validate(payload: Payload, done: VerifiedCallback): 
    Promise<UserEntity> {
        const { id } = payload
        const user = await this.userService.findById(id)
        if (!user) {
            throw new UnauthorizedException({ message: '회원이 존재하지 않습니다.'});
        }

        return user;
    }
}

export interface Payload {
    id: number;
    //role:string
}