import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SessionMiddleware } from './sessionMiddleware.middleware';
import { RedisModule } from '../../modules/redis/redis.module';
import { RedisService } from '../../modules/redis/redis.service';

@Module({
    imports: [RedisModule],
    providers: [SessionMiddleware, RedisService],
})
export class SessionMiddlewareModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(SessionMiddleware)
            .exclude(
                { path: '/api/auth/login', method: RequestMethod.POST },
                { path: '/api/auth/register', method: RequestMethod.POST },
            )
            .forRoutes('*');
    }
}