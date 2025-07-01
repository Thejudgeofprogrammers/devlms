import { BadRequestException, Body, Controller, Delete, Get, MethodNotAllowedException, NotFoundException, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Contacts, Course, User, UserCourses, UserFriends, UserInfo } from '@prisma/client';
import { ResponseDTO } from './dto';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Get(':user_id')
    async getUserById(
        @Param('user_id') userId: number,
    ): Promise<Omit<User, 'password'>> {
        if (!userId) {
            throw new BadRequestException();
        }
        const user = await this.userService.findUserById(userId);
        if (!user) {
            throw new NotFoundException()
        }
        const { password, ...safeUser } = user;
        return safeUser;
    }

    @Get(':user_id/detal')
    async getUserByIdDetals(
        @Param('user_id') userId: number,
    ): Promise<UserInfo> {
        if (!userId) {
            throw new BadRequestException();
        }
        return await this.userService.getUserInfo(userId);
    }

    @Get(':user_id/contacts')
    async getUserByIdContacts(
        @Param('user_id') userId: number,
    ): Promise<Contacts> {
        if (!userId) {
            throw new BadRequestException();
        }
        return await this.userService.getUserContacts(userId);
    }

    @Get(':user_id/friends')
    async getUserByIdFriends(
        @Param('user_id') userId: number,
    ): Promise<UserFriends[]> {
        if (!userId) {
            throw new BadRequestException();
        }
        return await this.userService.getUserFriends(userId);
    }

    @Get(':user_id/courses')
    async getUserByIdCourses(
        @Param('user_id') userId: number,
    ): Promise<Course[]> {
        if (!userId) {
            throw new BadRequestException();
        }
        return await this.userService.getUserCourses(userId);
    }

    @Put(':user_id/profile')
    async updateByIdProfile(
        @Param('user_id') userId: number,
        @Body() payload: any,
    ): Promise<ResponseDTO> {
        if (!userId || !payload) {
            throw new BadRequestException();
        }

        // Проверка
        throw new MethodNotAllowedException()
    }

    @Put(':user_id/profile/advanced')
    async updateByIdTeacherInfo(
        @Param('user_id') userId: number,
        @Body() payload: any,
    ): Promise<ResponseDTO> {
        throw new MethodNotAllowedException()
    }

    @Delete(':user_id')
    async deleteById(
        @Param('user_id') userId: number,
    ): Promise<ResponseDTO> {
        throw new MethodNotAllowedException()
    }
}
