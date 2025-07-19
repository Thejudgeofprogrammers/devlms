import { Controller, Get, InternalServerErrorException, Req, Res } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { Request, Response } from "express";

@Controller('redis')
export class RedisController {
    constructor(
        private readonly redisService: RedisService,
    ) {}

    @Get('session')
    async getSession(
        @Res() res: Response,
        @Req() req: Request,
    ) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Unauthorized: No Bearer token' });
            }

            const jwtToken = authHeader.split(' ')[1];

            const { userId } = await this.redisService.getUserSession({ jwtToken })
            console.log('Authorization header:', jwtToken);

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            return res.json({ userId });
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}