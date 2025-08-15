import { Body, Controller, Delete, Get, MethodNotAllowedException, Param, Post, Put } from '@nestjs/common';
import { Teacher } from '@prisma/client';
import { ResponseDTO } from '../user/dto';
import { TeachersService } from './teachers.service';
import { CreateTeacherDTO, UpdateTeacherDTO } from './dto';

@Controller('teachers')
export class TeachersController {
    constructor(private readonly teachersService: TeachersService) {}

    @Post('')
    async createTeacher(@Body() data: CreateTeacherDTO): Promise<ResponseDTO> {
        return await this.teachersService.createTeacher(data);
    }

    @Get('')
    async findAll(): Promise<Teacher[]> {
        return await this.teachersService.getAllTeachers();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Teacher> {
        return await this.teachersService.findOneTeacher(Number(id));
    }

    @Put(':id')
    async updateOne(@Param('id') id: string, @Body() data: UpdateTeacherDTO): Promise<ResponseDTO> {
        return await this.teachersService.updateOneTeacher(Number(id), data);
    }

    @Delete(':id')
    async removeTeacher(@Param('id') id: string): Promise<ResponseDTO> {
        return await this.teachersService.deleteTeacher(Number(id));
    }

    @Post(':id/photo')
    async updatePhoto(@Param('id') id: string): Promise<ResponseDTO> {
        throw new Error()
    }
}
