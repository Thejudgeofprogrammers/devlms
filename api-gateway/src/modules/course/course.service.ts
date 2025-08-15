import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';
import { ResponseDTO } from '../user/dto';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class CourseService {
    constructor(private readonly prisma: PrismaService) { }
    async getCourses() {
        return this.prisma.course.findMany();
    }

    async updateCourseById(course_id: number, info: UpdateCourseDto): Promise<ResponseDTO> {
        try {
            const course = await this.prisma.course.findUnique({ where: { course_id } })
            if (!course) {
                throw new NotFoundException()
            }

            await this.prisma.course.update({
                where: { course_id }, data: {
                    plan_course: info.plan_course,
                    name: info.name
                }
            })

            return { message: 'Курс Обновлен', status: 200 }
        } catch (e) {
            console.error(e)
            throw new InternalServerErrorException(e)
        }
    }

    async getCourseById(course_id: number) {
        try {
            const course = await this.prisma.course.findUnique({ where: { course_id } });
            if (!course) throw new NotFoundException();
            return course;
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    }

    async createCourse(data: CreateCourseDto) {
        try {
            return await this.prisma.course.create({ data });
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    }

    async deleteCourseById(course_id: number) {
        try {
            const findCourse = await this.prisma.course.findUnique({ where: { course_id: Number(course_id) } })

            if (!findCourse) {
                throw new NotFoundException()
            }

            const filePath = join(process.cwd(), 'uploads', 'courses', `${course_id}.jpg`);

            if (filePath) {
                try {
                    await fs.access(filePath);
                    await fs.unlink(filePath);
                } catch (err) {
                    if (err.code !== 'ENOENT') {
                        throw err;
                    }
                }
            }

            return await this.prisma.course.delete({ where: { course_id } })
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    }

    async getParticipants(course_id: number) {
        try {
            const users = await this.prisma.courseParticipants.findMany({
                where: { course_id },
                include: {
                    user: {
                        select: {
                            user_id: true,
                            email: true
                        }
                    }
                }
            })

            if (!users) {
                throw new NotFoundException()
            }

            return users
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    }

    async addParticipant(course_id: number, user_id: number) {
        try {
            const findRelation = await this.prisma.courseParticipants.findUnique({
                where: {
                    course_id_user_id: {
                        course_id,
                        user_id
                    }
                }
            })

            if (findRelation) {
                throw new BadRequestException('Пользователь уже добавлен')
            }

            const userRelation = await this.prisma.courseParticipants.create({
                data: {
                    course_id,
                    user_id
                }
            })

            if (!userRelation) {
                throw new InternalServerErrorException()
            }

            return { message: 'Пользователь добавлен в курс', status: 201 }
        } catch (e) {
            console.error(e)
            throw new InternalServerErrorException(e)
        }
    }

    async deleteParticipantById(course_id: number, user_id: number) {
        try {
            const deleteRelation = await this.prisma.courseParticipants.delete({
                where: {
                    course_id_user_id: {
                        course_id,
                        user_id
                    }
                }
            })

            if (!deleteRelation) {
                throw new NotFoundException()
            }

            return { message: 'Пользователь удален с курса', status: 200 }
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    }
}
