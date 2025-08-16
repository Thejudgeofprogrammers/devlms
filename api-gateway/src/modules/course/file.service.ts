import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { File } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { join } from "path";
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class FileService {
    constructor(private readonly prisma: PrismaService) { }

    async getFiles(
        payload: {
            task_id: number
        }
    ): Promise<File[]> {
        try {
            return await this.prisma.file.findMany({
                where: { task_id: payload.task_id },
            });
        } catch (e) {
            console.error(e)
            throw new InternalServerErrorException()
        }
    }

    async getFile(
        payload: {
            task_id: number;
            file_id: number;
        }
    ): Promise<File> {
        try {
            return await this.prisma.file.findUnique({
                where: {
                    file_id: payload.file_id, task_id: payload.task_id
                },
            });
        } catch (e) {
            console.error(e)
            throw new InternalServerErrorException()
        }
    }

    async addFile(
        payload: {
            task_id: number;
            original_name: string;
            file_path: string;
            mime_type: string;
            size: number;
        }
    ): Promise<File> {
        try {
            return await this.prisma.file.create({
                data: {
                    task_id: payload.task_id,
                    original_name: payload.original_name,
                    file_path: payload.file_path,
                    mime_type: payload.mime_type,
                    size: payload.size,
                },
            });
        } catch (e) {
            console.error(e)
            throw new InternalServerErrorException()
        }
    }

    async delFile(payload: { task_id: number; file_id: number }): Promise<{ status: number }> {
        try {
            const file = await this.prisma.file.findFirst({
                where: {
                    file_id: payload.file_id,
                    task_id: payload.task_id,
                },
            });

            if (!file) throw new NotFoundException("Файл не найден");


            const filePath = join(process.cwd(), 'uploads', 'tasks', file.file_path);

            console.log('Удаляем файл:', filePath, existsSync(filePath));

            if (existsSync(filePath)) {
                unlinkSync(filePath);
            }

            await this.prisma.file.delete({
                where: { file_id: payload.file_id },
            });

            return { status: 200 };
        } catch (e) {
            if (e instanceof NotFoundException) throw e;
            console.error(e);
            throw new InternalServerErrorException();
        }
    }
}