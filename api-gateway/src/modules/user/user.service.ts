import { HttpException, Injectable, InternalServerErrorException, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { Contacts, Course, Role, User, UserFriends, UserInfo } from '@prisma/client';
import { RegisterUserDTO, RegisterUserResponse } from '../auth/dto';
import { StatusClient } from 'src/common/status';
import { PrismaService } from '../prisma/prisma.service';
import { HashService } from '../hash/hash.service';
import { ResponseDTO } from './dto';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly hashService: HashService,
    ) { }

    async deleteUserById(user_id: number): Promise<ResponseDTO> {
        try {
            const user = await this.prisma.user.findUnique({ where: { user_id: Number(user_id) } })
            if (!user) {
                throw new NotFoundException()
            }

            const filePath = join(process.cwd(), 'uploads', 'users', `${user_id}.jpg`)

            if (filePath) {
                try {
                    await fs.access(filePath);
                    await fs.unlink(filePath);
                } catch (err) {
                    if (err.code !== 'ENOENT') {
                        throw err;
                    }
                }
            }

            await this.prisma.user.delete({ where: { user_id: Number(user_id) } })
            return { message: 'Пользователь удалён', status: 200 }
        } catch (e) {
            console.error("DeleteError user", e);
            throw new InternalServerErrorException(e);
        }
    }

    async updateRolerById(user_id: number, role: string): Promise<ResponseDTO> {
        try {
            const user = await this.prisma.user.findUnique({ where: { user_id: Number(user_id) } });
            if (!user) throw new NotFoundException('Пользователь не найден');

            const newRole = await this.prisma.role.findFirst({
                where: { role: { equals: role, mode: 'insensitive' } }
            });
            if (!newRole) throw new NotFoundException('Роль не найдена');

            await this.prisma.user.update({
                where: { user_id: Number(user_id) },
                data: { role_id: newRole.role_id }
            });

            return { message: 'Роль изменена', status: 200 };
        } catch (e) {
            console.error("UpdateError role", e);
            throw new InternalServerErrorException(e);
        }
    }

    async getUsersWithoutPassword() {
        return await this.prisma.user.findMany({
            select: {
                user_id: true,
                email: true,
                phone_number: true,
                role: {
                    select: {
                        role: true,
                    }
                }
            }
        });
    }

    async getUserWithoutPassword(user_id: number) {
        return await this.prisma.user.findUnique({
            where: { user_id: Number(user_id) },
            select: {
                user_id: true,
                email: true,
                phone_number: true,
                role: {
                    select: {
                        role: true,
                    }
                }
            }
        });
    }

    async getUserWithoutPasswordByEmail(email: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email },
            });

            delete user.password

            return user
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    }

    async findUserById(userId: number): Promise<User> {
        const user_id = Number(userId)
        return await this.withTryCatch(() => this.getUserOrThrow(user_id), 'findUserById');
    }

    async findUserByEmail(email: string): Promise<User> {
        return await this.withTryCatch(async () => {
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (!user) throw new NotFoundException();
            return user;
        }, 'findUserByEmail');
    }

    async findUserByLogin(login: string): Promise<User> {
        return await this.withTryCatch(async () => {
            const user = await this.prisma.user.findUnique({ where: { login } });
            if (!user) throw new NotFoundException();
            return user;
        }, 'findUserByLogin');
    }


    async findUserByPhone(phoneNumber: string): Promise<User> {
        return await this.withTryCatch(async () => {
            const user = await this.prisma.user.findUnique({ where: { phone_number: phoneNumber } });
            if (!user) throw new NotFoundException();
            return user;
        }, 'findUserByPhone');
    }

    async findUserRole(userId: number): Promise<Role> {
        const user = await this.getUserOrThrow(userId);
        const role = await this.prisma.role.findUnique({ where: { role_id: user.role_id } });
        if (!role) throw new NotFoundException(`Роль для пользователя ${userId} не найдена`);
        return role;
    }

    async getUserInfo(userId: number): Promise<UserInfo> {
        return await this.withTryCatch(async () => {
            const user = await this.getUserOrThrow(Number(userId));
            return this.prisma.userInfo.findUnique({ where: { user_info_id: user.user_info_id } });
        }, 'getUserInfo');
    }

    async getUserContacts(userId: number): Promise<Contacts> {
        return await this.withTryCatch(async () => {
            const user = await this.getUserOrThrow(Number(userId));
            return this.prisma.contacts.findUnique({ where: { contact_id: user.contacts_id } });
        }, 'getUserContacts');
    }

    async getUserFriends(userId: number): Promise<UserFriends[]> {
        return await this.withTryCatch(async () => {
            await this.getUserOrThrow(Number(userId));
            return this.prisma.userFriends.findMany({ where: { user_id: Number(userId) } });
        }, 'getUserFriends');
    }

    async getUserCourses(userId: number): Promise<Course[]> {
        return await this.withTryCatch(async () => {
            await this.getUserOrThrow(Number(userId));
            const userCourses = await this.prisma.userCourses.findMany({
                where: { user_id: Number(userId) },
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
        const user = await this.prisma.user.findUnique({ where: { user_id: Number(userId) } });
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
