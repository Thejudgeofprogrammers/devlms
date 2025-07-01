import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());

    const configService = app.get(ConfigService);
    const port = configService.get<number>('port');
    await app.listen(port);
}
bootstrap();
