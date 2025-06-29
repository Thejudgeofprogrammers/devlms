import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
    constructor(
        private readonly prismaService: PrismaService,
    ) {}

    async saveMessage() {
        
    }

    async getMessages() {
        
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
