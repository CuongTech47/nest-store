import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import * as session from 'express-session'
import * as passport from "passport";
async function bootstrap() {
  // const app = await NestFactory.create<NestFastifyApplication>(
  //   AppModule,
  //   new FastifyAdapter(),
  // );
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe());
  app.use(session({
    secret : 'sdadsadsadsadsa',
    saveUninitialized :false,
    resave : false,
    cookie : {
      maxAge : 60000,

    }
  }))
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })
  app.use(passport.initialize())
  app.use(passport.session())
  await app.listen(3000);
}
bootstrap();
