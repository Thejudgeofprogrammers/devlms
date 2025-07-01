import { Controller, Get } from '@nestjs/common';
import { Teacher } from '@prisma/client';

@Controller('teachers')
export class TeachersController {
    @Get('teachers')
    async getTeachers(): Promise<Teacher[]> {}

    @Get('teachers/:user_id')
    async getTeacherById(): Promise<Teacher> {
        
    }
}
