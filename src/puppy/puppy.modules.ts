import { Module } from '@nestjs/common';
import { RedisProvider } from 'src/db/redis/redis.provider';
import { PuppyController } from './controllers/puppy.controller';
import { PuppyService } from './services/puppy.service';

@Module({
  controllers: [PuppyController],
  providers: [PuppyService, RedisProvider],
  exports: [PuppyService],
})
export class PuppyModule {}
