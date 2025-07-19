import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { HashModule } from '../hash/hash.module';
import { TokenModule } from '../token/token.module';
import { RedisModule } from '../redis/redis.module';

@Module({
    imports: [
        HashModule,
        TokenModule,
        RedisModule,
        UserModule,
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
