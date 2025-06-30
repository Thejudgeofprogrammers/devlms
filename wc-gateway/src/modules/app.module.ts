import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { PrismaModule } from './prisma/prisma.module';
import { LlmModule } from './llm/llm.module';

@Module({
    imports: [ChatModule, PrismaModule, LlmModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
