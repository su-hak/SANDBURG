import { Controller, Get, Post, Delete, Patch, Body, UseGuards, Param, Req, UnauthorizedException, Query, NotFoundException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin, AdminStatus } from './admin.model';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminDTO } from './dto/admin.dto';
import { AdminNameDTO } from './dto/admin.name.dto';
import { AdminEntity } from './entities/admin.entity';
import { Roles } from 'src/decorator/Roles.decorator';


@ApiTags('운영 게시판')
@Controller('admin')
export class AdminController {

    constructor(private readonly adminService: AdminService) { }

    @Get()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: '모든 운영 게시물', description: '모든 운영 게시물을 조회합니다.' })
    @ApiResponse({ status: 200, description: '운영 게시물 조회 성공' })
    @ApiResponse({ status: 403, description: '권한이 없습니다.' })
    getAllAdmin(): Promise<AdminEntity[]> {
        return this.adminService.getAllAdmins('admin');
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: '게시글 작성', description: '게시글을 작성합니다' })
    @ApiBody({ type: AdminNameDTO.Request.AdminDetail })
    @ApiResponse({ status: 201, description: '게시글 작성에 성공했습니다.' })
    @ApiResponse({ status: 403, description: '권한이 없습니다.' })
    createAdmin(
        @Req() req: any,
        @Body() adminDto: AdminDTO
    ): Promise<AdminEntity> {
        const user = req.user;
        if (!user) {
            throw new UnauthorizedException('유저를 찾을 수 없습니다.')
        }
        const author = user.nickname;

        console.log('Author in Controller:', author); // 디버깅 로그 추가

        return this.adminService.createAdmin(adminDto, author, 'admin');

    }

    @Get('/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: '게시물 찾기', description: '게시물 고유번호로 게시물을 찾습니다.' })
    @ApiResponse({ status: 200, description: '게시물 찾기를 성공했습니다.' })
    @ApiResponse({ status: 403, description: '권한이 없습니다.' })
    getAdminById(
        @Param('id') id: string): Promise<AdminEntity> {
        return this.adminService.getAdminById(id, 'admin');
    }

    @Get('author/:author')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: '작성자로 게시물 찾기', description: '작성자로 게시물을 찾습니다.' })
    @ApiResponse({ status: 200, description: '게시물 찾기를 성공했습니다.' })
    @ApiResponse({ status: 403, description: '권한이 없습니다.' })
    getAdminByAuthor(@Query('author') author: string): Promise<AdminEntity[]> {
        return this.adminService.getAdminByAuthor(author, 'admin');
    }

    @Get('title/:title')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: '제목으로 게시물 찾기', description: '제목으로 게시물을 찾습니다.' })
    @ApiResponse({ status: 200, description: '게시물 찾기를 성공했습니다.' })
    @ApiResponse({ status: 403, description: '권한이 없습니다.' })
    async getAdminByTitle(@Query('title') title: string): Promise<AdminEntity[]> {
        return this.adminService.getAdminByTitle(title, 'admin');
    }

    @Delete('/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: '게시물 삭제', description: '게시물 고유번호로 찾은 게시물을 삭제합니다.' })
    @ApiResponse({ status: 200, description: '게시물 삭제를 성공했습니다.' })
    @ApiResponse({ status: 403, description: '권한이 없습니다.' })
    deleteAdmin(
        @Param('id') id: string): Promise<void> {
        return this.adminService.deleteAdmin(id, 'admin');
    }

    @Patch('/:id/status')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: '게시물 수정', description: '게시물 고유번호로 찾은 게시물을 수정합니다.' })
    @ApiBody({ type: AdminNameDTO.Request.AdminUpdate })
    @ApiResponse({ status: 200, description: '게시물 수정을 성공했습니다.' })
    @ApiResponse({ status: 403, description: '권한이 없습니다.' })
    updateAdmin(
        @Param('id') id: string,
        @Body() updateAdminDto: AdminDTO,
    ): Promise<AdminEntity> {
        return this.adminService.updateAdmin(id, updateAdminDto, 'admin');
    }
}
