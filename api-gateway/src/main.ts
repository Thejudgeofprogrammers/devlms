import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: ['http://localhost:5173', 'http://localhost:5174'],
        credentials: true,
        allowedHeaders: ['Authorization', 'Content-Type'],
    });

    app.use(cookieParser());

    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
        .setTitle('Api-gateway lms system')
        .setDescription('Документация API для lms системы')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const configService = app.get(ConfigService);
    const port = configService.get<number>('port');
    await app.listen(port);
}
bootstrap();
