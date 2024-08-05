import { Controller, Get, Post, Delete, Patch, Body, UseGuards, Param, Req, UnauthorizedException, Query, NotFoundException } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeStatus } from './notice.model';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NoticeDTO } from './dto/notice.dto';
import { NoticeNameDTO } from './dto/notice.name.dto';
import { NoticeEntity } from './entities/notice.entity';
import { Roles } from 'src/decorator/Roles.decorator';

@ApiTags('공지 게시판')
@Controller('notice')
export class NoticeController {

    constructor(private readonly noticeService: NoticeService) { }

    @Get()
    @ApiOperation({ summary: '모든 공지 게시물', description: '모든 공지 게시물을 조회합니다.' })
    @ApiResponse({ status: 200, description: '공지 게시물 조회 성공' })
    getAllNotice(): Promise<NoticeEntity[]> {
        return this.noticeService.getAllNotice('notice');
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: '게시글 작성', description: '게시글을 작성합니다' })
    @ApiBody({ type: NoticeNameDTO.Request.NoticeDetail })
    @ApiResponse({ status: 201, description: '게시글 작성에 성공했습니다.' })
    @ApiResponse({ status: 403, description: '권한이 없습니다.' })
    createNotice(
        @Req() req: any,
        @Body() noticeDto: NoticeDTO
    ): Promise<NoticeEntity> {
        const user = req.user;
        if (!user) {
            throw new UnauthorizedException('유저를 찾을 수 없습니다.')
        }
        const author = user.nickname;
        return this.noticeService.createNotice(noticeDto, author, 'notice');
        
    }

    @Get('/:id')
    @ApiOperation({ summary: '게시물 찾기', description: '게시물 고유번호로 게시물을 찾습니다.' })
    @ApiResponse({ status: 200, description: '게시물 찾기를 성공했습니다.' })
    getNoticeById(
        @Param('id') id: string): Promise<NoticeEntity> {
        return this.noticeService.getNoticeById(id, 'notice');
    }

    @Get('author/:author')
    @ApiOperation({ summary: '작성자로 게시물 찾기', description: '작성자로 게시물을 찾습니다.' })
    @ApiResponse({ status: 200, description: '게시물 찾기를 성공했습니다.' })
    getNoticeByAuthor(@Query('author') author: string): Promise<NoticeEntity[]> {
        return this.noticeService.getNoticeByAuthor(author, 'notice');
    }

    @Get('title/:title')
    @ApiOperation({ summary: '제목으로 게시물 찾기', description: '제목으로 게시물을 찾습니다.' })
    @ApiResponse({ status: 200, description: '게시물 찾기를 성공했습니다.' })
    async getNoticeByTitle(@Query('title') title: string): Promise<NoticeEntity[]> {
            return this.noticeService.getNoticeByTitle(title,'notice');
    }

    @Delete('/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: '게시물 삭제', description: '게시물 고유번호로 찾은 게시물을 삭제합니다.' })
    @ApiResponse({ status: 200, description: '게시물 삭제를 성공했습니다.' })
    @ApiResponse({ status: 403, description: '권한이 없습니다.' })
    deleteNotice(
        @Param('id') id: string): Promise<void> {
        return this.noticeService.deleteNotice(id,'notice');
    }

    @Patch('/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: '게시물 수정', description: '게시물 고유번호로 찾은 게시물을 수정합니다.' })
    @ApiBody({ type: NoticeNameDTO.Request.NoticeUpdate })
    @ApiResponse({ status: 200, description: '게시물 수정을 성공했습니다.' })
    @ApiResponse({ status: 403, description: '권한이 없습니다.' })
    updateNotice(
        @Param('id') id: string,
        @Body() updateNoticeDto: NoticeDTO,
    ): Promise<NoticeEntity> {
        return this.noticeService.updateNotice(id, updateNoticeDto, 'notice');
    }
}
