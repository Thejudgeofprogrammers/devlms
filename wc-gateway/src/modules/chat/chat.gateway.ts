import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { TypePerson } from 'prisma/generated/mongodb';
import { LlmService } from '../llm/llm.service';

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:5174',
    },
    transports: ['websocket'],
    path: '/socket.io'
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly chatService: ChatService,
        private readonly llmService: LlmService,
    ) { }

    async handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    async handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('join_chat')
    async joinChat(@MessageBody() payload: { chatId: string }, @ConnectedSocket() client: Socket) {
        client.join(payload.chatId);
    }

    @SubscribeMessage('get_chats')
    async getChats(
        @MessageBody() payload: { userId: string },
        @ConnectedSocket() client: Socket
    ) {
        const chats = await this.chatService.getChats(payload.userId)
        client.emit('get_chats', { chats })
    }

    @SubscribeMessage('get_chat')
    async getChat(
        @MessageBody() payload: { userId: string, chatId: string }
    ) {
        if (!payload.userId) {
            throw new BadRequestException()
        }

        const id_user = Number(payload.userId)
        const chat = await this.chatService.getChatById({ chatId: payload.chatId })

        if (chat.user_id !== id_user) {
            throw new ForbiddenException()
        }

        this.server.emit('get_chat', {
            chat
        })
    }

    @SubscribeMessage('get_messages')
    async getMessages(
        @MessageBody() payload: { chatId: string }
    ) {
        const messages = await this.chatService.getMessages(payload)

        this.server.emit('get_messages', {
            messages
        })
    }

    @SubscribeMessage('send_message')
    async sendMessage(
        @MessageBody() payload: { chatId: string, text: string, userId: string }
    ) {
        const userMessage = await this.chatService.saveMessage({
            userId: payload.userId,
            text: payload.text,
            chatId: payload.chatId,
            owner: TypePerson.user
        })

        const messages = await this.chatService.getMessages({ chatId: payload.chatId });
        const formattedMessages = messages.map(m => ({
            role: m.owner === TypePerson.user ? 'user' : 'assistant',
            text: m.text
        }));

        const llmResponseText = await this.llmService.sendMessage(
            formattedMessages,
            '',
            payload.text
        );

        const botMessage = await this.chatService.saveMessage({
            userId: payload.userId,
            chatId: payload.chatId,
            text: llmResponseText,
            owner: TypePerson.bot,
        })

        this.server.to(payload.chatId).emit('send_message', userMessage);
        this.server.to(payload.chatId).emit('send_message', botMessage)

        return { userMessage, botMessage }
    }

    @SubscribeMessage('create_chat')
    async createNewChat(
        @MessageBody() payload: { userId: number },
        @ConnectedSocket() client: Socket
    ) {
        const createChat = await this.chatService.createNewChat({ userId: payload.userId.toString() })

        client.emit('create_chat', { createChat })
    }

    @SubscribeMessage('update_name')
    async updateNameChat(
        @MessageBody() payload: { chatId: string, name: string }
    ) {
        const updateName = await this.chatService.updateNameChat({ chatId: payload.chatId, name: payload.name });

        this.server.emit('update_name', {
            updateName
        })
    }

    @SubscribeMessage('delete_chat')
    async deleteChat(
        @MessageBody() payload: { chatId: string, userId: string }
    ) {
        if (!payload.chatId || !payload.userId) {
            throw new BadRequestException()
        }

        const id_user = Number(payload.userId)
        const chatById = await this.chatService.getChatById({ chatId: payload.chatId })
        if (chatById.user_id !== id_user) {
            throw new ForbiddenException()
        }

        const deleteChat = await this.chatService.deleteChat({ chatId: payload.chatId })

        this.server.emit('delete_chat', {
            deleteChat
        })
    }
}
