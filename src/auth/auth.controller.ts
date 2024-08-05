import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UserDTO } from "src/user/dto/userDto";
import { AuthDTO } from "./dto/authDto";
import * as bcrypt from 'bcrypt';
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";


@Controller()
export class AuthController {
    constructor(
    ) { }
    // @Post('/signin')
    // @ApiOperation({ summary: '로그인', description: '로그인합니다.' })
    // @ApiBody({ type: UserDTO.Request.SignIn })
    // @ApiResponse({ status: 201, description: '로그인에 성공하였습니다!' })
    // @ApiResponse({ status: 404, description: '로그인에 실패하였습니다.' })
    // async signin(@Body() authDTO: AuthDTO.SignIn) {
    //   const { email, password } = authDTO;
  
    //   const user = await this.userService.findByEmail(email);
    //   if (!user) {
    //     throw new UnauthorizedException('이메일 또는 비밀번호를 확인해 주세요.');
    //   }
  
    //   const isSamePassword = bcrypt.compareSync(password, user.password);
    //   if (!isSamePassword) {
    //     throw new UnauthorizedException('이메일 또는 비밀번호를 확인해 주세요.');
    //   }
  
    //   const payload = {
    //     id: user.id,
    //   }
  
    //   const accessToken = this.jwtService.sign(payload)
  
    //   return "로그인 완료" + '\n' + accessToken;
    // }
}