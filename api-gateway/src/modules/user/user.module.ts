import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { HashModule } from '../hash/hash.module';

@Module({
    imports: [PrismaModule, HashModule],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule { }
