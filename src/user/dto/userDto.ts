import { ApiProperty } from "@nestjs/swagger";

export namespace UserDTO {

    export namespace Request {

        export class SignIn {

            @ApiProperty({ description: '이메일', default:
                'test@test.com'
            })
            email: string;

            @ApiProperty({ description: '비밀번호', default: 
                'test' 
            })
            password: string;
        }

        export class SignUp {

            @ApiProperty({ description: '이메일', default: 
                'test@test.com'
            })
            email: string;

            @ApiProperty({ description: '비밀번호', default: 
                'test'
            })
            password: string;

            @ApiProperty({ description: '닉네임', default:
                'testMan'
            })
            nickname: string;
        }
    }
}