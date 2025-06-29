import { HttpException, Inject, Injectable, InternalServerErrorException, MethodNotAllowedException } from '@nestjs/common';
import { PrismaClient, Role, User } from '@prisma/client';
import { RegisterUserDTO, RegisterUserResponse } from '../auth/dto';
import { StatusClient } from 'src/common/status';

@Injectable()
export class UserService {
    constructor(
        @Inject('PrismaService') private prisma: PrismaClient,
    ) { }

    async findUserById(userId: number): Promise<User> {
        try {
            throw new MethodNotAllowedException()
        } catch (e) {
            if (e instanceof HttpException) {
                console.error('HTTP ошибка:', e.message);
                throw e;
            }
            console.error('Ошибка в функции findUserById');
            throw new InternalServerErrorException(e);
        }
    }

    async findUserByEmail(email: string): Promise<User> {
        try {
            throw new MethodNotAllowedException()
        } catch (e) {
            if (e instanceof HttpException) {
                console.error('HTTP ошибка:', e.message);
                throw e;
            }
            console.error('Ошибка в функции findUserByEmail');
            throw new InternalServerErrorException(e);
        }
    }

    async findUserByLogin(login: string): Promise<User> {
        try {
            throw new MethodNotAllowedException()
        } catch (e) {
            if (e instanceof HttpException) {
                console.error('HTTP ошибка:', e.message);
                throw e;
            }
            console.error('Ошибка в функции findUserByLogin');
            throw new InternalServerErrorException(e);
        }
    }

    async findUserByPhone(phoneNumber: string): Promise<User> {
        try {
            throw new MethodNotAllowedException()
        } catch (e) {
            if (e instanceof HttpException) {
                console.error('HTTP ошибка:', e.message);
                throw e;
            }
            console.error('Ошибка в функции findUserByPhone');
            throw new InternalServerErrorException(e);
        }
    }

    async findUserRole(userId: number): Promise<Role> {
        try {
            throw new MethodNotAllowedException()
        } catch (e) {
            if (e instanceof HttpException) {
                console.error('HTTP ошибка:', e.message);
                throw e;
            }
            console.error('Ошибка в функции findUserRole');
            throw new InternalServerErrorException(e);
        }
    }

    async createUser(payload: RegisterUserDTO): Promise<RegisterUserResponse> {
        try {
            return {
                status: StatusClient.HTTP_STATUS_CREATED.status,
                message: StatusClient.HTTP_STATUS_CREATED.message,
            }
        } catch (e) {
            if (e instanceof HttpException) {
                console.error('HTTP ошибка:', e.message);
                throw e;
            }
            console.error('Ошибка в функции createUser');
            throw new InternalServerErrorException(e);
        }
    }
}
