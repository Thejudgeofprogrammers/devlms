import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RedisService } from '../../modules/redis/redis.service';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
    constructor(private readonly redisService: RedisService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            if (['/api/auth/login', '/api/auth/register'].includes(req.originalUrl)) {
                return next();
            }
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Unauthorized: No Bearer token' });
            }

            const jwtToken = authHeader.split(' ')[1];
            const userId = req.cookies?.userId;

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const response = await this.redisService.getUserSession({ userId });
            if (!response || response.jwtToken !== jwtToken) {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }

            next();
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                message: 'Server have a problem in session route',
            });
        }
    }
}