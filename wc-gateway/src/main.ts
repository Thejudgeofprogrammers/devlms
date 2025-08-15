import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());

    const configService = app.get(ConfigService);
    app.enableCors({ origin: 'http://localhost:5174' });
    const port = configService.get<number>('port');
    await app.listen(port);
}
bootstrap();
