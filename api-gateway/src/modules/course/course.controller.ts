import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { Course } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto, ResponseCourse } from './dto';

@Controller('course')
export class CourseController {
    constructor(
        private readonly prismaService: PrismaService,
    ) {}

    @Get('')
    async getCourses(): Promise<Course[]> {
        const courses = await this.prismaService.course.findMany();
        if (!courses) {
            throw new NotFoundException()
        }

        return courses;
    }

    @Get(':course_id')
    async getCoursesById(
        @Param('course_id') course_id: number,
    ): Promise<Course> {
        const course = await this.prismaService.course.findUnique({
            where: { course_id }
        })

        if (!course) {
            throw new NotFoundException()
        }

        return course;
    }

    @Post('')
    async createCourse(@Body() data: CreateCourseDto): Promise<ResponseCourse> {
      const course = await this.prismaService.course.create({
        data: {
          name: data.name,
          plan_course: data.plan_course,
        },
      });
  
      return {
        message: 'Курс успешно создан',
        data: course,
      };
    }
}
