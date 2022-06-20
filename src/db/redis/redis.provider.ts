import { Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { createClient } from 'redis';
import config from 'src/config';

@Injectable()
export class RedisProvider {
  private configuration: ConfigType<typeof config> = config();

  private readonly redisClient = createClient({
    url: this.configuration.redis.url,
  });

  constructor() {
    this.redisClient.connect();
    this.redisClient.on('error', (err) =>
      console.log('Redis Client Error', err),
    );
    this.redisClient.on('connect', () => console.log('Redis Client Connected'));
  }

  async get(key: string) {
    const redisValue = await this.redisClient.get(key);
    return JSON.parse(redisValue);
  }

  async update(key: string, value: any) {
    const cacheTimeOut = parseInt(this.configuration.redis.cacheTimeOut);
    const parsedRedisValue = JSON.stringify(value);
    await this.redisClient.setEx(key, cacheTimeOut, parsedRedisValue);
    console.log('Redis updated');
    return true;
  }

  async delete(key: string) {
    await this.redisClient.del(key);
    console.log('Redis deleted');
    return true;
  }

  async getKeys(pattern: string) {
    const keys = await this.redisClient.keys(pattern);
    return keys;
  }

  async getAllKeys() {
    const keys = await this.redisClient.keys('*');
    return keys;
  }

  async getKeysInclude(pattern: string) {
    const keys = [];
    const redisKeys = await this.getAllKeys();
    redisKeys.forEach((key) => {
      if (key.includes(pattern)) {
        keys.push(key);
      }
    });

    return keys;
  }

  // TODO: DELETE WITH REGEX
}
