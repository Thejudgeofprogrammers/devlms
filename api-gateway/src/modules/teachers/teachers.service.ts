import { Injectable } from '@nestjs/common';

@Injectable()
export class TeachersService {
    private async getUserOrThrow(userId: number): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { user_id: userId } });
        if (!user) throw new NotFoundException(`Пользователь с id ${userId} не найден`);
        return user;
    }

    private async withTryCatch<T>(fn: () => Promise<T>, context = ''): Promise<T> {
        try {
            return await fn();
        } catch (e) {
            if (e instanceof HttpException) {
                console.error(`HTTP ошибка в ${context}:`, e.message);
                throw e;
            }
            console.error(`Ошибка в функции ${context}`);
            throw new InternalServerErrorException(e);
        }
    }
}
