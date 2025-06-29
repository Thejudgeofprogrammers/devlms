import { Controller, Delete, Get, MethodNotAllowedException, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Contacts, User, UserCourses, UserFriends, UserInfo } from '@prisma/client';
import { ResponseDTO } from './dto';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get(':user_id')
    async getUserById(

    ): Promise<User> {
        throw new MethodNotAllowedException()
    }

    @Get(':user_id/detal')
    async getUserByIdDetals(

    ): Promise<UserInfo> {
        throw new MethodNotAllowedException()
    }

    @Get(':user_id/detal')
    async getUserByIdDetal(

    ): Promise<UserInfo> {
        throw new MethodNotAllowedException()
    }

    @Get(':user_id/contacts')
    async getUserByIdContacts(

    ): Promise<Contacts> {
        throw new MethodNotAllowedException()
    }

    @Get(':user_id/friends')
    async getUserByIdFriends(

    ): Promise<UserFriends> {
        throw new MethodNotAllowedException()
    }

    @Get(':user_id/courses')
    async getUserByIdCourses(

    ): Promise<UserCourses> {
        throw new MethodNotAllowedException()
    }

    @Get(':user_id/courses/:course_id')
    async getUserByIdCourseById(

    ): Promise<UserCourses> {
        throw new MethodNotAllowedException()
    }

    @Put(':user_id/profile')
    async updateByIdProfile(

    ): Promise<ResponseDTO> {
        throw new MethodNotAllowedException()
    }

    @Put(':user_id/profile/advanced')
    async updateByIdTeacherInfo(

    ): Promise<ResponseDTO> {
        throw new MethodNotAllowedException()
    }

    @Delete(':user_id')
    async deleteById(

    ): Promise<ResponseDTO> {
        throw new MethodNotAllowedException()
    }
}
