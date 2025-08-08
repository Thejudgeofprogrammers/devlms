import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { Course, Task } from '@prisma/client';
import { CreateCourseDto, CreateTaskDTO, ResponseCourse, ResponseTask, UpdateTaskDTO } from './dto';
import { CourseService } from './course.service';
import { TaskService } from './task.service';

@Controller('course')
export class CourseController {
    constructor(
        private readonly courseService: CourseService,
        private readonly taskService: TaskService,
    ) { }

    @Get(':course_id/tasks')
    async getTasks(
        @Param('course_id') course_id: string,
    ): Promise<Task[]> {
        if (!course_id) {
            throw new BadRequestException()
        }
        const tasks = await this.taskService.getTasksByCourseId(Number(course_id));
        
        if (!tasks) {
            throw new BadRequestException()
        }

        return tasks
    }

    @Get(':course_id/tasks/:task_id')
    async getTaskById(
        @Param('course_id') course_id: string,
        @Param('task_id') task_id: string,
    ): Promise<Task> {
        if (!course_id || !task_id) {
            throw new BadRequestException()
        }
        const task = await this.taskService.getTaskById(Number(course_id), Number(task_id));
        
        if (!task) {
            throw new BadRequestException()
        }

        return task
    }

    @Post(':course_id/tasks')
    async createTask(
        @Param('course_id') course_id: string,
        @Body() data: CreateTaskDTO,
    ): Promise<ResponseTask> {
        if (!course_id) {
            throw new BadRequestException()
        }
        return await this.taskService.createTask(Number(course_id), data);
    }

    @Put(':course_id/tasks/:task_id')
    async updateTask(
        @Param('course_id') course_id: string,
        @Param('task_id') task_id: string,
        @Body() data: UpdateTaskDTO,
    ): Promise<ResponseTask> {
        if (!course_id || !task_id) {
            throw new BadRequestException()
        }
        return await this.taskService.updateTask(Number(course_id), Number(task_id), data);
    }

    @Delete(':course_id/tasks/:task_id')
    async deleteTask(
        @Param('course_id') course_id: string,
        @Param('task_id') task_id: string,
    ): Promise<ResponseTask> {
        if (!course_id || !task_id) {
            throw new BadRequestException()
        }
        return await this.taskService.deleteTask(Number(course_id), Number(task_id));
    }

    @Get('')
    async getCourses(): Promise<Course[]> {
        const courses = await this.courseService.getCourses();
        if (!courses) {
            throw new NotFoundException()
        }

        return courses;
    }

    @Get(':course_id')
    async getCoursesById(
        @Param('course_id') course_id: string,
    ): Promise<Course> {
        if (!course_id) {
            throw new BadRequestException()
        }

        const course = await this.courseService.getCourseById(Number(course_id))

        if (!course) {
            throw new NotFoundException()
        }

        return course;
    }

    @Post('')
    async createCourse(@Body() data: CreateCourseDto): Promise<ResponseCourse> {
        if (!data.name) {
            throw new BadRequestException()
        }

        const course = await this.courseService.createCourse({
            name: data.name,
            plan_course: data.plan_course,
        });

        return {
            message: 'Курс успешно создан',
            data: course,
        };
    }

    @Delete(':course_id')
    async deleteCourse(@Param('course_id') course_id: string) {
        if (!course_id) {
            throw new BadRequestException()
        }

        return await this.courseService.deleteCourseById(Number(course_id))
    }
}
