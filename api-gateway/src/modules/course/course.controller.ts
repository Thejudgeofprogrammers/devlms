import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Course, CourseParticipants, File, Task } from '@prisma/client';
import { CreateCourseDto, CreateTaskDTO, ResponseCourse, ResponseTask, UpdateCourseDto, UpdateTaskDTO } from './dto';
import { CourseService } from './course.service';
import { TaskService } from './task.service';
import { ResponseDTO } from '../user/dto';
import { UserService } from '../user/user.service';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller('course')
export class CourseController {
    constructor(
        private readonly userService: UserService,
        private readonly courseService: CourseService,
        private readonly taskService: TaskService,
        private readonly fileService: FileService,
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

    @Get(':task_id/files')
    async getFiles(
        @Param('task_id') task_id: string,
    ): Promise<File[]> {
        if (!task_id) throw new BadRequestException();

        const files = await this.fileService.getFiles({
            task_id: Number(task_id),
        });

        if (!files.length) {
            return []
        }

        return files;
    }

    @Get(':task_id/files/:file_id')
    async getFile(
        @Param('task_id') task_id: string,
        @Param('file_id') file_id: string,
        @Res() res: Response
    ) {
        const file = await this.fileService.getFile({
            task_id: Number(task_id),
            file_id: Number(file_id)
        })

        const filePath = join(process.cwd(), 'uploads', 'tasks', file.file_path)

        if (!existsSync(filePath)) {
            throw new NotFoundException('Файл не найден')
        }

        res.set({
            'Content-Type': file.mime_type,
            'Content-Disposition': `attachment; filename="${file.original_name}"`,
        })

        return res.sendFile(filePath)
    }

    @Post(':task_id/files')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/tasks',
            filename: (req, file, cb) => {
                const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');

                const safeName = `${Date.now()}-${originalName.replace(/[^\w\d.-]/g, '_')}`;

                cb(null, safeName);
            }
        })
    }))
    async addFile(
        @UploadedFile() file: Express.Multer.File,
        @Param('task_id') task_id: string,
    ): Promise<File> {
        if (!task_id) {
            throw new BadRequestException()
        }

        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const safeName = `${Date.now()}-${originalName.replace(/[^\w\d.-]/g, '_')}`;


        return await this.fileService.addFile({
            task_id: Number(task_id),
            original_name: originalName,
            file_path: safeName,
            mime_type: file.mimetype,
            size: Number(file.size),
        });
    }

    @Delete(':task_id/files/:file_id')
    async delFile(
        @Param('task_id') task_id: string,
        @Param('file_id') file_id: string,
    ): Promise<{ status: number }> {
        if (!task_id || !file_id) {
            throw new BadRequestException()
        }

        return await this.fileService.delFile({
            task_id: Number(task_id),
            file_id: Number(file_id),
        });
    }
}
