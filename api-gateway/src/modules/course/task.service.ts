import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateTaskDTO, ResponseTask, UpdateTaskDTO } from "./dto";
import { Task } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TaskService {
    constructor(private readonly prisma: PrismaService) { }

    async getTasksByCourseId(course_id: number): Promise<Task[]> {
        try {
            const tasks = await this.prisma.task.findMany({ where: { course_id } })
            if (!tasks) {
                throw new NotFoundException()
            }

            return tasks;
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    }

    async getTaskById(course_id: number, task_id: number): Promise<Task> {
        try {
            const task = await this.prisma.task.findFirst({ where: { course_id, task_id } });
            if (!task) throw new NotFoundException();
            return task;
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async createTask(course_id: number, data: CreateTaskDTO): Promise<ResponseTask> {
        try {
            const task = await this.prisma.task.create({
                data: {
                    course_id,
                    title: data.title,
                    description: data.description || null,
                    deadline: data.deadline ? new Date(data.deadline) : null,
                }
            });

            if (!task) {
                throw new InternalServerErrorException()
            }

            return { message: 'Задача создана', status: 201 };
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async updateTask(course_id: number, task_id: number, data: UpdateTaskDTO): Promise<ResponseTask> {
        try {
            const task = await this.prisma.task.findFirst({ where: { course_id, task_id } });
            if (!task) throw new NotFoundException();

            const updated = await this.prisma.task.update({
                where: { task_id },
                data: {
                    title: data.title,
                    description: data.description ?? null,
                    deadline: data.deadline ? new Date(data.deadline) : null
                }
            });

            if (!updated) {
                throw new InternalServerErrorException()
            }

            return {
                message: 'Задача обновлена',
                status: 200,
            };
        } catch (e) {
            console.error('UPDATE ERROR:', e);
            throw new InternalServerErrorException(e);
        }
    }

    async deleteTask(course_id: number, task_id: number): Promise<ResponseTask> {
        try {
            const task = await this.prisma.task.findFirst({ where: { course_id, task_id } });
            if (!task) throw new NotFoundException();

            await this.prisma.task.delete({
                where: { task_id }
            });

            return {
                message: 'Задача удалена',
                status: 200,
            };
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}