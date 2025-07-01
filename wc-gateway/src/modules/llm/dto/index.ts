import { IsString, IsDate } from 'class-validator';

export class MessageDTO {
    @IsString()
    messageId: string;

    @IsString()
    role: string;

    @IsString()
    text: string;

    @IsDate()
    createdAt: Date;
}
