import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { HashModule } from './hash/hash.module';
import { TokenModule } from './token/token.module';
import configuration from '../config/config.main';
import { RedisModule } from './redis/redis.module';
import { SessionMiddlewareModule } from '../middlewares/sessionMiddleware/sessionMiddleware.module';
import { PrismaModule } from './prisma/prisma.module';
import { CourseModule } from './course/course.module';
import { PhotoModule } from './photo/photo.module';
import { TeachersModule } from './teachers/teachers.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '../../.env',
            isGlobal: true,
            load: [configuration]
        }),
        AuthModule,
        UserModule,
        HashModule,
        TokenModule,
        RedisModule,
        SessionMiddlewareModule,
        PrismaModule,
        CourseModule,
        PhotoModule,
        TeachersModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
