import { BadRequestException, HttpException, Injectable, InternalServerErrorException, MethodNotAllowedException, UnauthorizedException } from '@nestjs/common';
import { LoginFormDTO, LoginUserDTO, LoginUserResponse, RegisterUserDTO, RegisterUserResponse, validationResponse } from './dto';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import { HashService } from '../hash/hash.service';
import { TokenService } from '../token/token.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly hashService: HashService,
        private readonly tokenService: TokenService,
        private readonly redisService: RedisService
    ) { }

    async loginUser(payload: LoginUserDTO): Promise<LoginUserResponse> {
        try {
            const { password, body, type } = payload;

            let user: User;
            if (type === 'email') {
                user = await this.userService.findUserByEmail(body);
            } else if (type === 'phone') {
                user = await this.userService.findUserByPhone(body);
            } else {
                user = await this.userService.findUserByLogin(body);
            }

            const comparedPassword = await this.hashService.comparePassword(
                password,
                user.password,
            );

            if (!comparedPassword) {
                throw new UnauthorizedException('Unauthorized user');
            }

            const token = this.tokenService.generateToken(user);

            const { message, status } = await this.redisService.saveUserSession({
                userId: user.user_id,
                jwtToken: token,
            });

            if (!message || !status) {
                throw new InternalServerErrorException('Server panic');
            }

            return { userId: user.user_id, jwtToken: token };
        } catch (e) {
            if (e instanceof HttpException) {
                console.error('HTTP ошибка:', e.message);
                throw e;
            }
            console.error('Ошибка в функции loginUser');
            throw new InternalServerErrorException(e);
        }
    }

    async registerUser(payload: RegisterUserDTO): Promise<RegisterUserResponse> {
        try {
            const { message, status } = await this.userService.createUser(payload);
            return { message, status };
        } catch (e) {
            if (e instanceof HttpException) {
                console.error('HTTP ошибка:', e.message);
                throw e;
            }
            console.error('Ошибка в функции loginUser');
            throw new InternalServerErrorException(e);
        }
    }

    public validation(payload: LoginFormDTO): validationResponse {
        const { data, password } = payload;
        if (!data || !password) {
            throw new BadRequestException();
        }

        const phonePattern =
            /^\+?\d{1,3}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (phonePattern.test(data)) {
            return { type: 'phone' };
        }

        if (emailPattern.test(data)) {
            return { type: 'email' };
        }

        return { type: 'login' }
    }
}
