import { BadRequestException, Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { summaryData } from '../../common/messages';
import { authDescription } from 'src/common/api/auth';
import { LoginFormDTO, LoginUserResponse, LogoutUserResponseDTO, RegisterUserDTO, RegisterUserResponse } from './dto';
import e, { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { myOptionalCookieOptions } from '../../config/config.cookie';
import { StatusClient } from 'src/common/status';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({
        summary: summaryData.loginUser,
        description: authDescription.loginDocs,
    })
    async loginUser(
        @Body() payload: LoginFormDTO,
        @Res() res: Response,
    ): Promise<void> {
        const validation = this.authService.validation(payload);

        const { jwtToken, userId } = await this.authService.loginUser({
            body: payload.data,
            password: payload.password,
            type: validation.type,
        })

        res.cookie('userId', userId.toString(), myOptionalCookieOptions);
        res.setHeader('Authorization', `Bearer ${jwtToken}`);

        res.json({ jwtToken, userId });
    }

    @Post('register')
    @ApiOperation({
        summary: summaryData.registerUser,
        description: authDescription.registerDocs,
    })
    async registerUser(
        @Body() payload: RegisterUserDTO,
    ): Promise<RegisterUserResponse> {
        const { login, password, email, phoneNumber } = payload

        if (!login || !password || !email || !phoneNumber) {
            throw new BadRequestException(StatusClient.HTTP_STATUS_BAD_REQUEST.message);
        }

        const { message, status } = await this.authService.registerUser(payload);

        return { message, status }
    }

    @Post('logout')
    async logoutUser(
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<Response<LogoutUserResponseDTO>> {
        try {
            const cookies = req.cookies;
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Unauthorized: No Bearer token' });
            }

            const jwtToken = authHeader.split(' ')[1];
            const data = { userId: parseInt(cookies.userId, 10), jwtToken };

            res.clearCookie('userId');

            if (!data.userId) {
                return res.status(400).json({ message: 'Bad request' });
            }

            const { message, status } = await this.authService.logout(data);

            if (!message || !status) {
                return res.status(500).json({ message: 'Provider problem' });
            }

            return res.status(status).json({ message });
        } catch (e) {
            return res.status(500).json({ message: 'Server have problem' });
        }
    }
}
