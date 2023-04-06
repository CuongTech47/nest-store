import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';

import { AtStrategy, RtStrategy } from './strategies';
import { GoogleStrategy } from './strategies/google.strategy';
import { PassportModule } from "@nestjs/passport";
import { SessionSerializer } from "./utils/Serializer";

@Module({
  imports: [JwtModule.register({}),PassportModule.register({
    session : true
  })],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    AtStrategy,
    RtStrategy,
    GoogleStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
