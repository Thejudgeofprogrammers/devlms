import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        UserService,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('jwt_options.secret'),
                signOptions: {
                    expiresIn: configService.get<string>('jwt_options.expire')
                },
            }),
        }),
    ],
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule { }
