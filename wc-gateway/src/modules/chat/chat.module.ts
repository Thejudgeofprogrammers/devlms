import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { LlmModule } from '../llm/llm.module';
import { LlmService } from '../llm/llm.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [LlmModule, PrismaModule],
  providers: [ChatGateway, ChatService, LlmService]
})
export class ChatModule {}
