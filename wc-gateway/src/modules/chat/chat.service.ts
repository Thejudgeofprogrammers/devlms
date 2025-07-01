import { HttpException, Injectable, InternalServerErrorException, MethodNotAllowedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewChatRequest, CreateNewChatResponse, GetMessagesRequest, GetMessagesResponse, SaveMessageRequest, SaveMessageResponse } from './dto';
import { Chat } from 'prisma/generated/mongodb';

@Injectable()
export class ChatService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async createNewChat(
        payload: CreateNewChatRequest
    ): Promise<CreateNewChatResponse> {
        try {
            const chat: Chat = await this.prisma.chat()
            return null;
        } catch (e) {
            if (e instanceof HttpException) {
                console.error(e);
                throw e;
            }
            throw new InternalServerErrorException('Ошибка в функции createNewChat: ', e)
        }
    }

    async saveMessage(
        payload: SaveMessageRequest
    ): Promise<SaveMessageResponse> {
        try {
            throw new MethodNotAllowedException();
        } catch (e) {
            if (e instanceof HttpException) {
                console.error(e);
                throw e;
            }
            throw new InternalServerErrorException('Ошибка в функции saveMessage: ', e)
        }
    }

    async getMessages(
        payload: GetMessagesRequest
    ): Promise<GetMessagesResponse> {
        try {
            throw new MethodNotAllowedException();
        } catch (e) {
            if (e instanceof HttpException) {
                console.error(e);
                throw e;
            }
            throw new InternalServerErrorException('Ошибка в функции getMessages: ', e)
        }
    }
}

// enum ChatType {
//   bot
//   user
// }

// model Chat {
//   id         String   @id @default(auto()) @map("_id") @db.ObjectId
//   chat_type  ChatType
//   owners     Int[]
//   created_at DateTime @default(now())
//   updated_at DateTime @updatedAt
// }

// model Message {
//   id         String   @id @default(auto()) @map("_id") @db.ObjectId
//   chat_id    String
//   owner      Int
//   text       String
//   created_at DateTime @default(now())
// }
