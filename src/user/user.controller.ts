import { Controller, Get, Post, Body, ConflictException, UnauthorizedException , Delete, UseGuards, Req, Patch, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthDTO } from 'src/auth/dto/authDto';
import { ApiOperation, ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserDTO } from './dto/userDto';
import { User } from 'src/decorator/user.decorator'
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@ApiTags('유저 API')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService, 
    private readonly jwtService: JwtService
  ) { }

  @Post('/signup')
  @ApiOperation({ summary: '회원가입', description: '회원 정보 추가' })
  @ApiBody({ type: UserDTO.Request.SignUp })
  @ApiResponse({ status: 201, description: '회원가입에 성공하였습니다!' })
  @ApiResponse({ status: 404, description: '회원가입에 실패하였습니다.' })
  async signup(@Body() authDTO: AuthDTO.SignUp) {
    const { email, nickname } = authDTO;

    const hasEmail = await
      this.userService.findByEmail(email);
    if (hasEmail) {
      throw new ConflictException('이미 사용중인 이메일 입니다.');
    }

    const hasNickname = await
      this.userService.findByNickname(nickname);
    if (hasNickname) {
      throw new ConflictException('이미 사용중인 닉네임 입니다.');
    }

    const userEntity = await
      this.userService.create(authDTO);

    return '회원가입 성공';
  }

  @Post('/signin')
    @ApiOperation({ summary: '로그인', description: '로그인합니다.' })
    @ApiBody({ type: UserDTO.Request.SignIn })
    @ApiResponse({ status: 201, description: '로그인에 성공하였습니다!' })
    @ApiResponse({ status: 404, description: '로그인에 실패하였습니다.' })
    async signin(@Body() authDTO: AuthDTO.SignIn) {
      const { email, password } = authDTO;
  
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('이메일 또는 비밀번호를 확인해 주세요.');
      }
  
      const isSamePassword = bcrypt.compareSync(password, user.password);
      if (!isSamePassword) {
        throw new UnauthorizedException('이메일 또는 비밀번호를 확인해 주세요.');
      }
  
      const payload = {
        id: user.id,
      }
  
      const accessToken = this.jwtService.sign(payload)
  
      return "로그인 완료" + '\n' + accessToken;
    }

  @ApiBearerAuth() // 토큰 필요한 api 잠구기
  @UseGuards(JwtAuthGuard)
  @Get('/')
  @ApiOperation({ summary: '프로필', description: '회원 정보 조회' })
  @ApiResponse({ status: 200, description: '프로필 조회에 성공하였습니다!' })
  async getProfile(@Req() req: any) {
    const user = req.user;
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('/')
  @ApiResponse({ status: 200, description: '회원 정보를 수정하였습니다!' })
  @ApiResponse({ status: 400, description: '수정할 수 없는 정보입니다.' })
  @ApiOperation({
    summary: '회원 정보 수정',
    description: '회원 정보를 수정합니다.'
  })
  async update(@User() user: UserEntity, @Body() updateUser: AuthDTO.UpdateUser) {
    const update = await this.userService.update(user.id, updateUser);
    return update;
  }

  @Delete('/')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '회원탈퇴',
    description: '회원 정보를 삭제합니다.'
    
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: '회원탈퇴에 성공하였습니다!' })
  async deleteID(@User() user: UserEntity) {
    await this.userService.delete(user);
    return { message: '회원탈퇴가 완료되었습니다.' };
  }

  @Post('/logout')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '로그아웃',
    description: '계정에서 로그아웃 합니다.'
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: '로그아웃에 성공하였습니다!' })
  async logout(@Req() req: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new BadRequestException('Authorization header is missing');
    }

    const token = req.headers.authorization.split(' ')[1]; // Authorization 헤더에서 토큰 추출
    if (!token) {
      throw new BadRequestException('Token is missing');
    }
    
    await this.userService.logout(token); // JWT를 블랙리스트에 추가
    return { message: '로그아웃 되었습니다.'}
  }
}
