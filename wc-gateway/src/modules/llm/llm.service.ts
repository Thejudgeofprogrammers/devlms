import { HttpException, Injectable, InternalServerErrorException, MethodNotAllowedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { sendMessageToLLMRequest } from './dto';

@Injectable()
export class LlmService {
    constructor(
        private readonly configService: ConfigService,
    ) {}
    
    async sendMessageToLLM(
        payload: sendMessageToLLMRequest,    
    ): Promise<{ message: string }>  {
        try {
            const response = await axios.post(
                this.configService.get<string>('giga.url'),
                {
                    model: 'GigaChat:latest',
                    messages: payload.messages,
                    temperature: 0.7,
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.configService.get<string>('giga.token')}`,
                        'Content-Type': 'application/json',
                    }
                }
            )

            response
        } catch (e) {
            if (e instanceof HttpException) {
                console.error(e);
                throw e;
            }
            throw new InternalServerErrorException('Ошибка в функции sendMessageToLLM: ', e);
        }
    }
}
