import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule } from '@nestjs/config';
import { RedisController } from './redis.controller';

@Module({
  imports: [ConfigModule],
  providers: [RedisService],
  controllers: [RedisController],
  exports: [RedisService],
})
export class RedisModule {}
