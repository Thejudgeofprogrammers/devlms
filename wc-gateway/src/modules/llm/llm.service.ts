import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { MessageDTO } from './dto';

@Injectable()
export class LlmService {
    constructor(
        private readonly configService: ConfigService,
    ) { }

    async sendMessage(messages: MessageDTO[], prompt: string, message_user: string) {
        try {
            const defaultPrompt = {
                'role': 'system',
                content: prompt + message_user,
            };

            const formattedMessages = messages.map((el) => ({
                role: el.role,
                content: el.text,
            }));

            const response: any = await axios.post(
                this.configService.get<string>('giga.url'),
                {
                    model: this.configService.get<string>('giga.model'),
                    messages: [defaultPrompt, ...formattedMessages],
                    temperature: this.configService.get<number>('giga.temperature'),
                    max_tokens: Number(this.configService.get<number>('giga.token')),
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.configService.get<string>('giga.api')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Ошибка GPT:', error.response?.data || error.message);
            throw error;
        }
    }
}
