import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskService } from './task.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { HashModule } from '../hash/hash.module';
import { FileService } from './file.service';

@Module({
  imports: [PrismaModule, UserModule, HashModule],
  providers: [CourseService, TaskService, UserService, FileService],
  controllers: [CourseController]
})
export class CourseModule {}
