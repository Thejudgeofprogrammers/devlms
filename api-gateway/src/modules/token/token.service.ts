import {
    BadRequestException,
    HttpException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) { }

    generateToken(payload: any): string {
        try {
            if (!payload) {
                throw new BadRequestException('Token bad request');
            }
            return this.jwtService.sign(payload);
        } catch (e) {
            if (e instanceof HttpException) {
                console.error('HTTP ошибка:', e.message);
                throw e;
            }
            throw new InternalServerErrorException('Token not create');
        }
    }

    async verifyToken(token: string): Promise<any> {
        try {
            if (!token) {
                throw new BadRequestException('Token bad request');
            }
            return await this.jwtService.verify(token);
        } catch (e) {
            if (e instanceof HttpException) {
                console.error('HTTP ошибка:', e.message);
                throw e;
            }
            throw new InternalServerErrorException('Token not create');
        }
    }

    decodeToken(token: string): any {
        if (!token) {
            throw new BadRequestException('Token bad request');
        }
        return this.jwtService.decode(token);
    }
}