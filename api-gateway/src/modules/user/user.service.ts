import { HttpException, Injectable, InternalServerErrorException, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { Contacts, Course, Role, User, UserFriends, UserInfo } from '@prisma/client';
import { RegisterUserDTO, RegisterUserResponse } from '../auth/dto';
import { StatusClient } from 'src/common/status';
import { PrismaService } from '../prisma/prisma.service';
import { HashService } from '../hash/hash.service';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly hashService: HashService,
    ) { }

    async findUserById(userId: number): Promise<User> {
        return this.withTryCatch(() => this.getUserOrThrow(userId), 'findUserById');
    }

    async findUserByEmail(email: string): Promise<User> {
        return this.withTryCatch(async () => {
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (!user) throw new NotFoundException();
            return user;
        }, 'findUserByEmail');
    }

    async findUserByLogin(login: string): Promise<User> {
        return this.withTryCatch(async () => {
            const user = await this.prisma.user.findUnique({ where: { login } });
            if (!user) throw new NotFoundException();
            return user;
        }, 'findUserByLogin');
    }


    async findUserByPhone(phoneNumber: string): Promise<User> {
        return this.withTryCatch(async () => {
            const user = await this.prisma.user.findUnique({ where: { phone_number: phoneNumber } });
            if (!user) throw new NotFoundException();
            return user;
        }, 'findUserByPhone');
    }

    async findUserRole(userId: number): Promise<Role> {
        return this.withTryCatch(async () => {
            const user = await this.getUserOrThrow(userId);
            const role = await this.prisma.role.findUnique({ where: { role_id: user.role_id } });
            return role;
        }, 'findUserRole');
    }

    async getUserInfo(userId: number): Promise<UserInfo> {
        return this.withTryCatch(async () => {
            const user = await this.getUserOrThrow(userId);
            return this.prisma.userInfo.findUnique({ where: { user_info_id: user.user_info_id } });
        }, 'getUserInfo');
    }

    async getUserContacts(userId: number): Promise<Contacts> {
        return this.withTryCatch(async () => {
            const user = await this.getUserOrThrow(userId);
            return this.prisma.contacts.findUnique({ where: { contact_id: user.contacts_id } });
        }, 'getUserContacts');
    }

    async getUserFriends(userId: number): Promise<UserFriends[]> {
        return this.withTryCatch(async () => {
            await this.getUserOrThrow(userId);
            return this.prisma.userFriends.findMany({ where: { user_id: userId } });
        }, 'getUserFriends');
    }

    async getUserCourses(userId: number): Promise<Course[]> {
        return this.withTryCatch(async () => {
            await this.getUserOrThrow(userId);
            const userCourses = await this.prisma.userCourses.findMany({
                where: { user_id: userId },
                include: { course: true },
            });
            return userCourses.map((uc) => uc.course);
        }, 'getUserCourses');
    }

    async createUser(payload: RegisterUserDTO): Promise<RegisterUserResponse> {
        try {
            const { password, phoneNumber, login, email } = payload;
            const passwordHash = await this.hashService.hashPassword(password);
            await this.prisma.user.create({
                data: {
                    login,
                    email,
                    phone_number: phoneNumber,
                    password: passwordHash,
                    photo_url: '',
                    first_entry: new Date(),
                    last_entry: new Date(),
                    chat_ids: [],

                    contacts: {
                        create: {
                            country: '',
                            city: '',
                            time_zone: '',
                        },
                    },

                    userInfo: {
                        create: {
                            name: '',
                            fam: '',
                            surname: '',
                            citizenship: '',
                            faculty: '',
                            speciality: '',
                            profile: '',
                            level_of_training: '',
                            form_learning: '',
                            study_group: '',
                            language: '',
                        },
                    },

                    role: {
                        create: {
                            role: 'User',
                        },
                    },
                },
            });

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

    private async getUserOrThrow(userId: number): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { user_id: userId } });
        if (!user) throw new NotFoundException(`Пользователь с id ${userId} не найден`);
        return user;
    }

    private async withTryCatch<T>(fn: () => Promise<T>, context = ''): Promise<T> {
        try {
            return await fn();
        } catch (e) {
            console.error(`Ошибка в функции ${context}:`, e);
            if (e instanceof HttpException) {
                console.error(`HTTP ошибка в ${context}:`, e.message);
                throw e;
            }
            console.error(`Ошибка в функции ${context}`);
            throw new InternalServerErrorException(e);
        }
    }

}
