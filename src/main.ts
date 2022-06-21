import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';

// SWAGGER BUILD DOCUMENTATION
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Extra config params to increase default values params for entry points (not necesary, but recommended)
import { json, urlencoded } from 'body-parser';

import { AppModule } from './app.module';

// Express server
const server: express.Express = express();

export const createNestServer = async (expressInstance: express.Express) => {
  const adapter = new ExpressAdapter(expressInstance);
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    adapter,
    {},
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // SWAGGER BUILD DOCUMENTATION
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API Backend|| Embat Puppy')
    .setVersion('1.0')
    .addServer('/embat-puppy-fb/us-central1/api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Increase default limits for entry points
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.enableCors();

  // const port = process.env.PORT || 3002;
  // await app.listen(port);

  app.init();

  return app;
};

createNestServer(server)
  .then((v) => console.log('Nest Ready'))
  .catch((err) => console.error('Nest broken', err));
export const api: functions.HttpsFunction = functions.https.onRequest(server);
