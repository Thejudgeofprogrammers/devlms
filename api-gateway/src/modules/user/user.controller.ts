import { BadRequestException, Body, Controller, Delete, Get, MethodNotAllowedException, NotFoundException, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Contacts, Course, User, UserCourses, UserFriends, UserInfo } from '@prisma/client';
import { ResponseDTO } from './dto';
import { PrismaService } from '../prisma/prisma.service';

type ProfileUpdatePayload = {
    userInfo?: Partial<{
      name: string;
      fam: string;
      surname: string;
      citizenship: string;
      faculty: string;
      speciality: string;
      profile: string;
      level_of_training: string;
      form_learning: string;
      study_group: string;
      language: string;
    }>;
    contacts?: Partial<{
      country: string;
      city: string;
      time_zone: string;
    }>;
};

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly prisma: PrismaService,
    ) { }

    @Get(':user_id')
    async getUserById(
        @Param('user_id') userId: number,
    ): Promise<Omit<User, 'password'>> {
        if (!userId) {
            throw new BadRequestException();
        }
        const id = Number(userId);
        const user = await this.userService.findUserById(id);
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
        const id = Number(userId);
        return await this.userService.getUserInfo(id);
    }

    @Get(':user_id/contacts')
    async getUserByIdContacts(
        @Param('user_id') userId: number,
    ): Promise<Contacts> {
        if (!userId) {
            throw new BadRequestException();
        }
        const id = Number(userId);
        return await this.userService.getUserContacts(id);
    }

    @Get(':user_id/friends')
    async getUserByIdFriends(
        @Param('user_id') userId: number,
    ): Promise<UserFriends[]> {
        if (!userId) {
            throw new BadRequestException();
        }
        const id = Number(userId);
        return await this.userService.getUserFriends(id);
    }

    @Get(':user_id/courses')
    async getUserByIdCourses(
        @Param('user_id') userId: number,
    ): Promise<Course[]> {
        if (!userId) {
            throw new BadRequestException();
        }
        const id = Number(userId);
        return await this.userService.getUserCourses(id);
    }

    @Put(':user_id/profile')
    async updateByIdProfile(
      @Param('user_id') userId: string,
      @Body() payload: ProfileUpdatePayload,
    ): Promise<ResponseDTO> {
      if (!payload || ( !payload.userInfo && !payload.contacts )) {
        throw new BadRequestException('Payload must contain userInfo or contacts data');
      }
    
      const id = Number(userId);
      if (isNaN(id)) {
        throw new BadRequestException('Invalid user_id');
      }
    
      const user = await this.prisma.user.findUnique({
        where: { user_id: id },
        select: { user_info_id: true, contacts_id: true },
      });
    
      if (!user) {
        throw new NotFoundException('User not found');
      }
    
      if (payload.userInfo) {
        await this.prisma.userInfo.update({
          where: { user_info_id: user.user_info_id },
          data: payload.userInfo,
        });
      }

      if (payload.contacts) {
        await this.prisma.contacts.update({
          where: { contact_id: user.contacts_id },
          data: payload.contacts,
        });
      }
    
      return {
        status: 200,
        message: 'User profile updated',
      };
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
