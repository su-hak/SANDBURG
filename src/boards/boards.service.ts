import { Injectable, NotFoundException } from '@nestjs/common';
import { Board, BoardStatus } from './boards.model';
import { v1 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardsDTO } from './dto/boards.dto';
import { BoardEntity } from './entities/board.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(BoardEntity)
        private boardRepository: Repository<BoardEntity>,
    ) { }

    // private boards: Board[] = [];

    getAllBoards(type: string): Promise<BoardEntity[]> {
        return this.boardRepository.find({ where: { type }});
    }

    async createBoard(boardsDto: BoardsDTO, author: string, type: string): Promise<BoardEntity> {
        const { title, description } = boardsDto;

        const board = this.boardRepository.create({
            title,
            description,
            status: BoardStatus.PUBLIC,
            author,
            type
        });
        await this.boardRepository.save(board);
        return board;
    }

    async getBoardById(id: string, type: string): Promise<BoardEntity> {
        const found = await this.boardRepository.findOne({ where: { id, type } });
        if (!found) {
            throw new NotFoundException(`"${id}"에 해당하는 게시물을 찾을 수 없습니다`);
        }
        return found;
    }

    async getBoardsByAuthor(author: string, type: string): Promise<BoardEntity[]> {
        return this.boardRepository.find({ where: { author, type }});
    }

    async getBoardsByTitle(title: string, type: string): Promise<BoardEntity[]> {
        return this.boardRepository.find({ where: { title, type }});
    }

    async deleteBoard(id: string, type: string): Promise<void> {
        const result = await this.boardRepository.delete({id, type});
        if (result.affected === 0) {
            throw new NotFoundException(`"${id}"에 해당하는 게시물을 찾을 수 없습니다`)
        }
    }

    async updateBoard(id: string, updateBoardDto: BoardsDTO, type: string): Promise<BoardEntity> {
        const board = await this.getBoardById(id, type);

        
        if (updateBoardDto.title) {
            board.title = updateBoardDto.title;
          }
          if (updateBoardDto.description) {
            board.description = updateBoardDto.description;
          }
          if (updateBoardDto.status) {
            board.status = updateBoardDto.status;
          }

        await this.boardRepository.save(board);
        return board;
    }
}
