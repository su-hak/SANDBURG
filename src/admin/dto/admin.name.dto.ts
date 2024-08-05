import { ApiProperty } from "@nestjs/swagger";

export namespace AdminNameDTO {
    export namespace Request {

        export class AdminDetail {

            @ApiProperty({
                description: '게시글 제목', default:
                    '제목을 입력하세요'
            })
            title: string;

            @ApiProperty({
                description: '게시글 내용', default:
                    '내용을 입력하세요'
            })
            description: string;
        }

        export class AdminUpdate {

            @ApiProperty({
                description: '게시글 제목', default:
                    '수정할 제목을 입력하세요'
            })
            title: string;

            @ApiProperty({
                description: '게시글 내용', default:
                    '수정할 내용을 입력하세요'
            })
            description: string;
        }
    }
}