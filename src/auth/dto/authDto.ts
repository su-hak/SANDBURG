import { ApiProperty } from "@nestjs/swagger";
import { IsEmail,IsOptional,IsString ,Length, IsIn} from "class-validator";
export namespace AuthDTO {
    export class SignUp {
      @IsEmail()
      email: string;
  
      @IsString()
      @Length(4, 20)
      password: string;
  
      @IsString()
      nickname: string;

      @IsString()
      @IsIn(['USER', 'ADMIN'])
      @ApiProperty({ description: '역할', default: 'USER' })
      role: string = 'USER'
    }
  
    export class SignIn {
      @IsEmail()
      email: string;
  
      @IsString()
      @Length(4, 20)
      password: string;
    }

    export class UpdateUser {
      @IsOptional()
      @IsString()
      @Length(4, 20)           
      @ApiProperty({ 
        description: '비밀번호', 
        default: '여기에 변경할 비밀번호를 적으세요.'
    })
    password?: string;


      @IsOptional()
      @IsString()
      @ApiProperty({
        description: '닉네임',
        default: '여기에 변경할 닉네임을 적으세요.'
    })
    nickname?: string;
    }
  }