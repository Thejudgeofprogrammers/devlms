import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewChatRequest, DeleteChatByIdRequest, getChatByIdRequest, GetMessagesRequest, SaveMessageRequest, UpdateNameChatRequest } from './dto';
import { Chat, Message, TypePerson } from 'prisma/generated/mongodb';

@Injectable()
export class ChatService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async createNewChat(
        payload: CreateNewChatRequest
    ): Promise<Chat> {
        try {
            console.log('payload.userId:', payload.userId);
            if (!payload.userId) {
                throw new BadRequestException('Не передан userId');
            }

            const chat = await this.prisma.chat.create({
                data: {
                    user_id: Number(payload.userId)
                }
            });

            return {
                id: chat.id,
                name: chat.name,
                user_id: Number(chat.user_id),
                created_at: chat.created_at,
                updated_at: chat.updated_at,
            };
        } catch (e) {
            console.error('Prisma error details:', e);
            this.handleError(e, 'Ошибка в функции createNewChat');
        }
    }

    async saveMessage(
        payload: SaveMessageRequest
    ) {
        try {
            if (!payload.chatId || !payload.text || payload.owner === undefined) {
                throw new BadRequestException('Отсутствуют обязательные поля');
            }

            const findChat = await this.prisma.chat.findUnique({
                where: { id: payload.chatId }
            });

            if (!findChat) {
                throw new NotFoundException('Чат не найден');
            }

            const message = await this.prisma.message.create({
                data: {
                    chat_id: payload.chatId,
                    owner: payload.owner as TypePerson,
                    text: payload.text
                }
            });

            return {
                messageId: message.id,
                chatId: message.chat_id,
                owner: message.owner,
                text: message.text,
                createdAt: message.created_at
            };
        } catch (e) {
            this.handleError(e, 'Ошибка в функции saveMessage');
        }
    }

    async getChatById(payload: getChatByIdRequest) {
        try {
            if (!payload.chatId) {
                throw new BadRequestException('Не передан id');
            }

            const findChat = await this.prisma.chat.findUnique({
                where: { id: payload.chatId }
            });

            if (!findChat) {
                throw new NotFoundException('Чат не найден');
            }

            return findChat;
        } catch (e) {
            this.handleError(e, 'Ошибка в функции getChatById');
        }
    }

    async getChats(user_id: string) {
        try {
            if (!user_id) {
                throw new BadRequestException('Не передан user_id');
            }
            const findChats = await this.prisma.chat.findMany({
                where: { user_id: Number(user_id) }
            });

            return findChats;
        } catch (e) {
            this.handleError(e, 'Ошибка в функции getChats');
        }
    }

    async updateNameChat(payload: UpdateNameChatRequest) {
        try {
            if (!payload.chatId || !payload.name) {
                throw new BadRequestException('Не передан chatId или name');
            }

            const chat = await this.prisma.chat.update({
                where: { id: payload.chatId },
                data: { name: payload.name }
            });

            return chat;
        } catch (e) {
            this.handleError(e, 'Ошибка в функции updateNameChat');
        }
    }

    async deleteChat(payload: DeleteChatByIdRequest) {
        try {
            if (!payload.chatId) {
                throw new BadRequestException('Не передан chatId');
            }

            await this.prisma.message.deleteMany({
                where: { chat_id: payload.chatId }
            });

            await this.prisma.chat.delete({
                where: { id: payload.chatId }
            });

            return { success: true };
        } catch (e) {
            this.handleError(e, 'Ошибка в функции deleteChat');
        }
    }

    async getMessages(
        payload: GetMessagesRequest
    ): Promise<Message[]> {
        try {
            if (!payload.chatId) {
                throw new BadRequestException('Не передан chatId');
            }

            const messages = await this.prisma.message.findMany({
                where: { chat_id: payload.chatId },
                orderBy: { created_at: 'asc' }
            });

            return messages
        } catch (e) {
            this.handleError(e, 'Ошибка в функции getMessages');
        }
    }

    private handleError(e: any, msg: string) {
        if (e instanceof HttpException) {
            console.error(e);
            throw e;
        }
        throw new InternalServerErrorException(msg, { cause: e });
    }
}
