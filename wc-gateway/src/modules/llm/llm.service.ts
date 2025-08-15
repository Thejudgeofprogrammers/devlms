import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as https from 'https'
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LlmService {
    private accessToken: string | null = null;
    private tokenExpiresAt: number | null = null;

    constructor(
        private readonly configService: ConfigService,
    ) { }

    private async fetchAccessToken(): Promise<string> {
        const clientId = this.configService.get<string>('giga.client_id')
        const clientSecret = this.configService.get<string>('giga.client_secret')

        const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

        const agent = new https.Agent({ rejectUnauthorized: false })

        const config: any = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${basicAuth}`,
                RqUID: uuidv4(),
            },
            httpsAgent: agent,
        }

        const resp: any = await axios.post(
            'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
            `scope=${this.configService.get<string>('giga.scope')}`,
            config
        )

        this.accessToken = resp.data.access_token;
        this.tokenExpiresAt = Date.now() + resp.data.expires_in * 1000 - 5000;

        return this.accessToken;
    }

    private async getAccessToken(): Promise<string> {
        if (this.accessToken && this.tokenExpiresAt && Date.now() < this.tokenExpiresAt) {
            return this.accessToken;
        }
        return await this.fetchAccessToken();
    }

    async sendMessage(
        messages: {
            role: string,
            text: string
        }[],
        prompt: string,
        message_user: string
    ) {
        try {
            const agent = new https.Agent({
                rejectUnauthorized: false,
            });


            const token = await this.getAccessToken();

            const defaultPrompt = {
                role: 'system',
                content: prompt + message_user,
            };

            const formattedMessages = messages.map(el => ({
                role: el.role,
                content: el.text,
            }));

            const config: any = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                httpsAgent: agent,
            };


            const response: any = await axios.post(
                this.configService.get<string>('giga.url'),
                {
                    model: this.configService.get<string>('giga.model'),
                    messages: [defaultPrompt, ...formattedMessages],
                    temperature: 0.6,
                    max_tokens: Number(this.configService.get<number>('giga.max_token')) || 512,
                },
                config,
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Ошибка GPT:', error.response?.data || error.message);
            throw error;
        }
    }
}
