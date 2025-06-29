import { BadRequestException, Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { summaryData } from '../../common/messages';
import { authDescription } from 'src/common/api/auth';
import { LoginFormDTO, LoginUserResponse, RegisterUserDTO, RegisterUserResponse } from './dto';
import e, { Response } from 'express';
import { AuthService } from './auth.service';
import { myOptionalCookieOptions } from '../../config/config.cookie';
import { StatusClient } from 'src/common/status';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({
        summary: summaryData.loginUser,
        description: authDescription.loginDocs,
    })
    async loginUser(
        @Body() payload: LoginFormDTO,
        @Res() res: Response,
    ): Promise<LoginUserResponse> {
        const validation = this.authService.validation(payload);
        
        const { jwtToken, userId } = await this.authService.loginUser({
            body: payload.data,
            password: payload.password,
            type: validation.type,
        })

        res.cookie('userId', userId.toString(), myOptionalCookieOptions);
        res.setHeader('Authorization', `Bearer ${jwtToken}`);

        return {
            jwtToken,
            userId,
        }
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
}
