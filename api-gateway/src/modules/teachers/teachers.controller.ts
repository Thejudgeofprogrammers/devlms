import { Controller, Get, MethodNotAllowedException } from '@nestjs/common';
import { Teacher } from '@prisma/client';

@Controller('teachers')
export class TeachersController {
    @Get('teachers')
    async getTeachers(): Promise<Teacher[]> {
        throw new MethodNotAllowedException()
    }

    @Get('teachers/:user_id')
    async getTeacherById(): Promise<Teacher> {
        throw new MethodNotAllowedException()
    }
}
