import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { Course, CourseParticipants, Task } from '@prisma/client';
import { CreateCourseDto, CreateTaskDTO, ResponseCourse, ResponseTask, UpdateCourseDto, UpdateTaskDTO } from './dto';
import { CourseService } from './course.service';
import { TaskService } from './task.service';
import { ResponseDTO } from '../user/dto';
import { UserService } from '../user/user.service';

@Controller('course')
export class CourseController {
    constructor(
        private readonly userService: UserService,
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
    async getCourses(
        @Query('userId') userId: string,
    ): Promise<Course[]> {
        const courses = await this.courseService.getCourses();
        if (!courses) {
            throw new NotFoundException()
        }

        const numberIdUser = Number(userId)
        const userCoursesPromises = courses.map(async (el) => {
            const courseById = await this.courseService.getParticipants(Number(el.course_id));
            if (courseById.find(el_o => el_o.user_id === numberIdUser)) {
                return { course_id: el.course_id, name: el.name, plan_course: el.plan_course };
            }
        });

        const userCourses = (await Promise.all(userCoursesPromises)).filter(Boolean);

        if (userCourses.length === 0) {
            const role = await this.userService.findUserRole(numberIdUser)
            if (role.role === 'Admin' || role.role === 'Teacher') {
                return courses
            } else {
                return []
            }
        }

        return userCourses
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

    @Put(':course_id')
    async updateCourse(
        @Param('course_id') course_id: string,
        @Body() data: UpdateCourseDto
    ): Promise<ResponseDTO> {
        if (!course_id) {
            throw new BadRequestException()
        }

        if (!data) {
            throw new BadRequestException()
        }

        return await this.courseService.updateCourseById(Number(course_id), data)
    }

    @Delete(':course_id')
    async deleteCourse(@Param('course_id') course_id: string) {
        if (!course_id) {
            throw new BadRequestException()
        }

        return await this.courseService.deleteCourseById(Number(course_id))
    }

    @Get(':course_id/participant')
    async getParticipants(
        @Param('course_id') course_id: string
    ): Promise<CourseParticipants[]> {
        if (!course_id) {
            throw new BadRequestException()
        }
        return await this.courseService.getParticipants(Number(course_id));
    }

    @Post(':course_id/participant/:user_id')
    async addParticipant(
        @Param('course_id') course_id: string,
        @Param('user_id') user_id: string,
    ): Promise<ResponseDTO> {
        if (!course_id || !user_id) {
            throw new BadRequestException()
        }
        return await this.courseService.addParticipant(Number(course_id), Number(user_id))
    }

    @Delete(':course_id/participant/:user_id')
    async delParticipant(
        @Param('course_id') course_id: string,
        @Param('user_id') user_id: string,
    ): Promise<ResponseDTO> {
        if (!course_id || !user_id) {
            throw new BadRequestException()
        }
        return await this.courseService.deleteParticipantById(Number(course_id), Number(user_id))
    }
}
