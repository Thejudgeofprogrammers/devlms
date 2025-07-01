import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { PrismaModule } from './prisma/prisma.module';
import { LlmModule } from './llm/llm.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/index';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '../../.env',
            isGlobal: true,
            load: [configuration]
        }),
        ChatModule,
        PrismaModule,
        LlmModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
