import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto';

@Injectable()
export class CourseService {
    constructor(private readonly prisma: PrismaService) { }
    async getCourses() {
        return this.prisma.course.findMany();
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
            return await this.prisma.course.delete({ where: { course_id }})
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    }
}
