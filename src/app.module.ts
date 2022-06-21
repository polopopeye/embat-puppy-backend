import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import * as Joi from 'joi';

import config from './config';
import { FirestoreModule } from './db/firestore/firestore.module';
import { PuppyModule } from './puppy/puppy.modules';

@Module({
  imports: [
    // VERIFICATIONS OF ENV VARIABLES
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        GOOGLE_PROJECT_ID: Joi.string().required(),
        GOOGLE_PRIVATE_KEY: Joi.string().required(),
        GOOGLE_CLIENT_EMAIL: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        REDIS_CACHE_TIME_SECONDS: Joi.number().required(),
      }),
    }),

    // FireStore Module
    FirestoreModule.forRoot({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        projectId: configService.get<string>('GOOGLE_PROJECT_ID'),
        // ANOTHER WAY TO AUTH - BUT MORE INSECURE
        // keyFilename: configService.get<string>(
        //   'GOOGLE_APPLICATION_CREDENTIALS',
        // ),
        credentials: {
          client_email: configService.get<string>('GOOGLE_CLIENT_EMAIL'),
          private_key: configService.get<string>('GOOGLE_PRIVATE_KEY'),
        },
      }),
      inject: [ConfigService],
    }),
    PuppyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
