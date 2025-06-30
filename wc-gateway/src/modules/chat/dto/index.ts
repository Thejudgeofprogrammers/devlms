import { Message } from 'prisma/generated/mongodb';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateNewChatResponse {
    @IsString()
    chat_id: string;

    @IsNumber()
    owner: number;

    message: Message;

    @IsDate()
    createdAt: Date;
    
    @IsDate()
    updatedAt: Date;
}

export class SaveMessageResponse {

}

export class GetMessagesResponse {

}

export class CreateNewChatRequest {

}

export class SaveMessageRequest {

}

export class GetMessagesRequest {

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