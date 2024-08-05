import { Injectable, NotFoundException } from '@nestjs/common';
import { Notice, NoticeStatus } from './notice.model';
import { InjectRepository } from '@nestjs/typeorm';
import { NoticeDTO } from './dto/notice.dto';
import { NoticeEntity } from './entities/notice.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NoticeService {
    constructor(
        @InjectRepository(NoticeEntity)
        private noticeRepository: Repository<NoticeEntity>,
    ) { }

    // private notices: Notice[] = [];

    getAllNotice(type: string): Promise<NoticeEntity[]> {
        return this.noticeRepository.find({ where: { type } });
    }

    async createNotice(noticeDTO: NoticeDTO, author: string, type: string): Promise<NoticeEntity> {
        const { title, description } = noticeDTO;

        const notice = this.noticeRepository.create({
            title,
            description,
            status: NoticeStatus.PUBLIC,
            author,
            type
        });
        await this.noticeRepository.save(notice);
        return notice;
    }

    async getNoticeById(id: string, type: string): Promise<NoticeEntity> {
        const found = await this.noticeRepository.findOne({ where: { id, type } });
        if (!found) {
            throw new NotFoundException(`"${id}"에 해당하는 게시물을 찾을 수 없습니다`);
        }
        return found;
    }

    async getNoticeByAuthor(author: string, type: string): Promise<NoticeEntity[]> {
        return this.noticeRepository.find({ where: { author, type }});
    }

    async getNoticeByTitle(title: string, type: string): Promise<NoticeEntity[]> {
        return this.noticeRepository.find({ where: { title, type }});
    }

    async deleteNotice(id: string, type: string): Promise<void> {
        const result = await this.noticeRepository.delete({ id, type });
        if (result.affected === 0) {
            throw new NotFoundException(`"${id}"에 해당하는 게시물을 찾을 수 없습니다`)
        }
    }

    async updateNotice(
        id: string, 
        updateNoticeDto: NoticeDTO,
        type: string,
    ): Promise<NoticeEntity> {
        const notice = await this.getNoticeById(id, type);

        if (updateNoticeDto.title) {
            notice.title = updateNoticeDto.title;
          }
          if (updateNoticeDto.description) {
            notice.description = updateNoticeDto.description;
          }
          if (updateNoticeDto.status) {
            notice.status = updateNoticeDto.status;
          }

        await this.noticeRepository.save(notice);
        return notice;
    }
}
