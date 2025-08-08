import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskService } from './task.service';

@Module({
  imports: [PrismaModule],
  providers: [CourseService, TaskService],
  controllers: [CourseController]
})
export class CourseModule {}
