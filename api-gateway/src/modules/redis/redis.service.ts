import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import {
    DeleteUserSessionRequestDTO,
    DeleteUserSessionResponseDTO,
    GetUserSessionRequestDTO,
    GetUserSessionResponseDTO,
    SaveUserSessionRequestDTO,
    SaveUserSessionResponseDTO,
} from './dto';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
    private readonly redis: Redis;

    constructor(configService: ConfigService) {
        this.redis = new Redis({
            port: configService.get<number>('redis.port'),
            host: configService.get<string>('redis.host'),
        });
    }

    async saveUserSession(
        data: SaveUserSessionRequestDTO,
    ): Promise<SaveUserSessionResponseDTO> {
        try {
            const { userId, jwtToken } = data;
            if (!userId) {
                throw new BadRequestException('Bad request');
            }

            await this.redis.set(jwtToken, userId.toString());

            return { message: 'User session save', status: 200 };
        } catch (e) {
            throw new InternalServerErrorException('Redis shutdown');
        }
    }

    async getUserSession(
        data: GetUserSessionRequestDTO,
    ): Promise<GetUserSessionResponseDTO> {
        try {
            console.log('Йоу')
            console.log('Redis data for token:', data);
            console.log('Йоу')
            const { jwtToken } = data;
            if (!jwtToken) {
                throw new BadRequestException('Bad request');
            }

            const userId = await this.redis.get(jwtToken);

            if (!userId) {
                throw new NotFoundException('Not found');
            }

            return { userId: Number(userId), jwtToken };
        } catch (e) {
            throw new InternalServerErrorException('Redis shutdown');
        }
    }

    async deleteUserSession(
        data: DeleteUserSessionRequestDTO,
    ): Promise<DeleteUserSessionResponseDTO> {
        try {
            const { userId } = data;
            if (!userId) {
                throw new BadRequestException('userId missing');
            }
            await this.redis.del(userId.toString());
            return { message: 'User session delete', status: 200 };
        } catch (e) {
            throw new InternalServerErrorException('Redis shutdown');
        }
    }
}