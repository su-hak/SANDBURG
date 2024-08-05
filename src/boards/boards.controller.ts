import { Controller, Get, Post, Delete, Patch, Body, UseGuards, Param, Req, UnauthorizedException, Query, NotFoundException, ForbiddenException } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board, BoardStatus } from './boards.model';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BoardsDTO } from './dto/boards.dto';
import { BoardNameDTO } from './dto/board.name.dto';
import { BoardEntity } from './entities/board.entity';


@ApiTags('자유 게시판')
@Controller('boards')
export class BoardsController {

    constructor(private readonly boardsService: BoardsService) { }

    @Get()
    @ApiOperation({ summary: '모든 자유 게시물', description: '모든 자유 게시물을 조회합니다' })
    getAllBoard(): Promise<BoardEntity[]> {
        return this.boardsService.getAllBoards('boards');
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: '게시글 작성', description: '게시글을 작성합니다' })
    @ApiBody({ type: BoardNameDTO.Request.BoardDetail })
    @ApiResponse({ status: 201, description: '게시글 작성에 성공했습니다.' })
    @ApiResponse({ status: 403, description: '권한이 없습니다.' })
    createBoard(
        @Req() req: any,
        @Body() boardsDto: BoardsDTO
    ): Promise<BoardEntity> {
        const user = req.user;
        if (!user) {
            throw new UnauthorizedException('유저를 찾을 수 없습니다.')
        }
        const author = user.nickname;
        return this.boardsService.createBoard(boardsDto, author, 'boards');

    }

    @Get('/:id')
    @ApiOperation({ summary: '게시물 찾기', description: '게시물 고유번호로 게시물을 찾습니다.' })
    @ApiResponse({ status: 200, description: '게시물 찾기를 성공했습니다.' })
    getBoardById(
        @Param('id') id: string): Promise<BoardEntity> {
        return this.boardsService.getBoardById(id, 'boards');
    }

    @Get('author/:author')
    @ApiOperation({ summary: '작성자로 게시물 찾기', description: '작성자로 게시물을 찾습니다.' })
    @ApiResponse({ status: 200, description: '게시물 찾기를 성공했습니다.' })
    getBoardsByAuthor(@Query('author') author: string): Promise<BoardEntity[]> {
        return this.boardsService.getBoardsByAuthor(author, 'boards');
    }

    @Get('title/:title')
    @ApiOperation({ summary: '제목으로 게시물 찾기', description: '제목으로 게시물을 찾습니다.' })
    @ApiResponse({ status: 200, description: '게시물 찾기를 성공했습니다.' })
    async getBoardsByTitle(@Query('title') title: string): Promise<BoardEntity[]> {
        return this.boardsService.getBoardsByTitle(title, 'boards');
    }

    @Delete('/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: '게시물 삭제', description: '게시물 고유번호로 찾은 게시물을 삭제합니다.' })
    @ApiResponse({ status: 200, description: '게시물 삭제를 성공했습니다.' })
    @ApiResponse({ status: 403, description: '권한이 없습니다.' })
    async deleteBoard(
        @Req() req: any,
        @Param('id') id: string): Promise<void> {
        const user = req.user;
        if (!user) {
            throw new UnauthorizedException('유저를 찾을 수 없습니다.')
        }

        const board = await this.boardsService.getBoardById(id, 'boards');
        if (board.author !== user.nickname) {
            throw new ForbiddenException('작성자만 삭제할 수 있습니다.')
        }
        return this.boardsService.deleteBoard(id, 'boards');
    }

    @Patch('/:id/status')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: '게시물 수정', description: '게시물 고유번호로 찾은 게시물을 수정합니다.' })
    @ApiBody({ type: BoardNameDTO.Request.BoardUpdate })
    @ApiResponse({ status: 200, description: '게시물 수정을 성공했습니다.' })
    @ApiResponse({ status: 403, description: '권한이 없습니다.' })
    async updateBoard(
        @Req() req: any,
        @Param('id') id: string,
        @Body() updateBoardDto: BoardsDTO,
    ): Promise<BoardEntity> {
        const user = req.user;
        if (!user) {
            throw new UnauthorizedException('유저를 찾을 수 없습니다.')
        }

        const board = await this.boardsService.getBoardById(id, 'boards')
        if (board.author !== user.nickname) {
            throw new ForbiddenException('작성자만 수정할 수 있습니다.')
        }

        return this.boardsService.updateBoard(id, updateBoardDto, 'boards');
    }
}
