import { Injectable, NotFoundException } from '@nestjs/common';
import { v1 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminDTO } from './dto/admin.dto';
import { AdminEntity } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { AdminStatus } from './admin.model';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(AdminEntity)
        private adminRepository: Repository<AdminEntity>,
    ) { }

    // private admins: admin[] = [];

    getAllAdmins(type: string): Promise<AdminEntity[]> {
        return this.adminRepository.find({ where: { type }});
    }

    async createAdmin(adminDto: AdminDTO, author: string, type: string): Promise<AdminEntity> {
        const { title, description } = adminDto;
        console.log('Author in Service:', author); // 디버깅 로그 추가
        const admin = this.adminRepository.create({
            title,
            description,
            status: AdminStatus.PUBLIC,
            author,
            type,
        });
        await this.adminRepository.save(admin);
        return admin;
    }

    async getAdminById(id: string, type: string): Promise<AdminEntity> {
        const found = await this.adminRepository.findOne({ where: { id, type } });
        if (!found) {
            throw new NotFoundException(`"${id}"에 해당하는 게시물을 찾을 수 없습니다`);
        }
        return found;
    }

    async getAdminByAuthor(author: string, type: string): Promise<AdminEntity[]> {
        return this.adminRepository.find({ where: { author, type }});
    }

    async getAdminByTitle(title: string, type: string): Promise<AdminEntity[]> {
        return this.adminRepository.find({ where: { title, type }});
    }

    async deleteAdmin(id: string, type: string): Promise<void> {
        const result = await this.adminRepository.delete({ id, type });
        if (result.affected === 0) {
            throw new NotFoundException(`"${id}"에 해당하는 게시물을 찾을 수 없습니다`)
        }
    }

    async updateAdmin(id: string, updateAdminDto: AdminDTO, type: string): Promise<AdminEntity> {
        const admin = await this.getAdminById(id, type);

        if (updateAdminDto.title) {
            admin.title = updateAdminDto.title;
          }
          if (updateAdminDto.description) {
            admin.description = updateAdminDto.description;
          }
          if (updateAdminDto.status) {
            admin.status = updateAdminDto.status;
          }

        await this.adminRepository.save(admin);
        return admin;
    }
}
