import { IsString } from 'class-validator';

export class CreateNewChatResponse {
    @IsString()
    chatId: string;
    @IsString()
    userId: string;
    createdAt: Date;
}

export class CreateNewChatRequest {
    @IsString()
    userId: string;
}

export class SaveMessageRequest {
    @IsString()
    chatId: string;
    @IsString()
    userId: string;
    @IsString()
    text: string;
    @IsString()
    owner: string;
}

export class GetMessagesRequest {
    @IsString()
    chatId: string;
}

export class UpdateNameChatRequest {
    @IsString()
    chatId: string;
    @IsString()
    name: string;
}

export class getChatByIdRequest {
    @IsString()
    chatId: string
}

export class DeleteChatByIdRequest {
    @IsString()
    chatId: string
}