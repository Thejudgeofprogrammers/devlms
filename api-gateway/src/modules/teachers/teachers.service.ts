import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ResponseDTO } from '../user/dto';
import { CreateTeacherDTO, UpdateTeacherDTO } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { Teacher } from '@prisma/client';

@Injectable()
export class TeachersService {
    constructor(private readonly prisma: PrismaService) { }

    async createTeacher(data: CreateTeacherDTO): Promise<ResponseDTO> {
        try {
            if (!data) {
                throw new BadRequestException()
            }

            await this.prisma.teacher.create({ data });

            return { message: 'Учитель создан', status: 201 }
        } catch (e) {
            console.error(e);
            throw new InternalServerErrorException(e)
        }
    }

    async getAllTeachers(): Promise<Teacher[]> {
        try {
            const teachers = await this.prisma.teacher.findMany({
                include: {
                    disciplines: true,
                    advancedTraining: true,
                    teachingCourses: true
                }
            })

            if (!teachers) {
                throw new NotFoundException()
            }

            return teachers
        } catch (e) {
            console.error(e);
            throw new InternalServerErrorException(e)
        }
    }

    async updateOneTeacher(id: number, info: UpdateTeacherDTO): Promise<ResponseDTO> {
        try {
            const teacher = await this.prisma.teacher.findUnique({ where: { teacher_id: id }})
            if (!teacher) {
                throw new NotFoundException()
            }

            await this.prisma.teacher.update({ where: { teacher_id: id}, data: {
                education: info.education,
                department: info.department,
                job_title: info.job_title
            }})

            return { message: 'Учитель обновлен', status: 200 }
        } catch (e) {
            console.error(e);
            throw new InternalServerErrorException(e)
        }
    }

    async findOneTeacher(id: number): Promise<Teacher> {
        try {
            const teacher = await this.prisma.teacher.findUnique({
                where: { teacher_id: id },
                include: {
                    disciplines: true,
                    advancedTraining: true,
                    teachingCourses: true,
                }
            })

            if (!teacher) {
                throw new NotFoundException()
            }

            return teacher
        } catch (e) {
            console.error(e);
            throw new InternalServerErrorException(e)
        }
    }

    async deleteTeacher(id: number): Promise<ResponseDTO> {
        try {
            const teacher = await this.prisma.teacher.findUnique({ where: { teacher_id: id } })

            if (!teacher) {
                throw new NotFoundException()
            }

            await this.prisma.teacher.delete({
                where: { teacher_id: id }
            })

            return { message: 'Учитель удалён', status: 200 }
        } catch (e) {
            console.error(e);
            throw new InternalServerErrorException(e)
        }
    }
}
