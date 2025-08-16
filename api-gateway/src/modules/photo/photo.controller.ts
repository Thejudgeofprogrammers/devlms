import { Controller, Get, InternalServerErrorException, NotFoundException, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { join } from 'path';
import { existsSync } from 'fs';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('photo')
export class PhotoController {
    constructor(
        private readonly photoService: PhotoService
    ) { }

    // ===== USER PHOTO =====
    @Get(':user_id/user')
    async getUserPhoto(
        @Param('user_id') userId: string,
        @Res() res: Response
    ) {
        try {
            const filePath = join(process.cwd(), 'uploads', 'users', `${userId}.jpg`)

            res.set({
                'Cache-Control': 'public, max-age=86400',
                'Content-Type': 'image/jpeg'
            });

            if (!existsSync(filePath)) {
                return res.sendFile(join(process.cwd(), 'pictures', 'temp.jpg'));
            }

            return res.sendFile(filePath);
        } catch (e) {
            console.error(e)
            throw new InternalServerErrorException(e)
        }
    }

    @Post(':user_id/user')
    @UseInterceptors(FileInterceptor('photo', {
        storage: diskStorage({
            destination: './uploads/users',
            filename: (req, file, cb) => cb(null, `${req.params.user_id}.jpg`)
        })
    }))
    async uploadUserPhoto(@UploadedFile() file: Express.Multer.File) {
        try {
            return { message: 'Фото пользователя загружено', file: file.filename };
        } catch (e) {
            console.error(e)
            throw new InternalServerErrorException(e)
        }
    }

    // ===== COURSE PHOTO =====
    @Get(':course_id/course')
    async getCoursePhoto(
        @Param('course_id') courseId: string,
        @Res() res: Response
    ) {
        try {
            const filePath = join(process.cwd(), 'uploads', 'courses', `${courseId}.jpg`)
            res.set({
                'Cache-Control': 'public, max-age=86400',
                'Content-Type': 'image/jpeg'
            });

            if (!existsSync(filePath)) {
                return res.sendFile(join(process.cwd(), 'pictures', 'temp.jpg'));
            }

            return res.sendFile(filePath);
        } catch (e) {
            console.error(e)
            throw new InternalServerErrorException(e)
        }
    }

    @Post(':course_id/course')
    @UseInterceptors(FileInterceptor('photo', {
        storage: diskStorage({
            destination: './uploads/courses',
            filename: (req, file, cb) => cb(null, `${req.params.course_id}.jpg`)
        })
    }))
    async uploadCoursePhoto(@UploadedFile() file: Express.Multer.File) {
        try {
            return { message: 'Фото курса загружено', file: file.filename };
        } catch (e) {
            console.error(e)
            throw new InternalServerErrorException(e)
        }
    }

    // ===== TEACHER PHOTO =====
    @Get(':teacher_id/teacher')
    async getTeacherPhoto(@Param('teacher_id') teacherId: string, @Res() res: Response) {
        try {
            const filePath = join(process.cwd(), 'uploads', 'teachers', `${teacherId}.jpg`);
            res.set({
                'Cache-Control': 'public, max-age=86400',
                'Content-Type': 'image/jpeg'
            });

            if (!existsSync(filePath)) {
                return res.sendFile(join(process.cwd(), 'pictures', 'temp.jpg'));
            }
            return res.sendFile(filePath);
        } catch (e) {
            console.error(e)
            throw new InternalServerErrorException(e)
        }
    }

    @Post(':teacher_id/teacher')
    @UseInterceptors(FileInterceptor('photo', {
        storage: diskStorage({
            destination: './uploads/teachers',
            filename: (req, file, cb) => cb(null, `${req.params.teacher_id}.jpg`)
        })
    }))
    async uploadTeacherPhoto(@UploadedFile() file: Express.Multer.File) {
        try {
            return { message: 'Фото преподавателя загружено', file: file.filename };
        } catch (e) {
            console.error(e)
            throw new InternalServerErrorException(e)
        }
    }
}
