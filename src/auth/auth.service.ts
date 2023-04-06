import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AuthDto, loginAuth } from './dto';
import * as argon from 'argon2';
import { Tokens, JwtPayload } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CustomerDetailsType } from './types/customerDetails.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async validateCustomer(customerDetails: CustomerDetailsType) {
    console.log('AuthService');
    console.log(customerDetails);

    const customer = await this.prisma.customer.findUnique({
      where: {
        email: customerDetails.email,
      },
    });

    console.log(customer);

    if (customer) {
      return customer;
    }

    const newCustomer =  await this.prisma.customer.create({
      data: {
        email: customerDetails.email,
        name: customerDetails.name,
        imgUrl: customerDetails.imgUrl,
        address: 'null',
        phone: 'null',
      },
    });
    return newCustomer
  }

  async findCustomer(customerId : number){
    const customer = await this.prisma.customer.findUnique({
      where : {
        customerId : customerId
      }
    })

    return customer
  }

  async signinLocal(dto: loginAuth): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');
    const passwordMatches = await argon.verify(user.password, dto.password);
    console.log(passwordMatches);
    if (!passwordMatches) throw new ForbiddenException('Truy cập bị từ chối');
    const tokens = await this.getTokens(user.userId, user.email, user.role);
    await this.updateRtHash(user.userId, tokens.refresh_token);

    return tokens;
  }
  async signupLocal(dto: AuthDto): Promise<Tokens> {
    const userExists = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (userExists) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    const password = await argon.hash(dto.password);

    const user = await this.prisma.user
      .create({
        data: {
          email: dto.email,
          username: dto.username,
          password: password,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('Credentials incorrect');
          }
        }
        throw error;
      });

    const tokens = await this.getTokens(user.userId, user.email, user.role);

    await this.updateRtHash(user.userId, tokens.refresh_token);

    return tokens;
  }
  async logout(userId: number): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: {
        userId: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
    return true;
  }

  async refeshTokens(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.hashedRt, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.userId, user.email, user.role);
    await this.updateRtHash(user.userId, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        userId: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }
  async getTokens(
    userId: number,
    email: string,
    role: string,
  ): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
      role: role,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.sign(jwtPayload, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: 60 * 15,
      }),
      this.jwtService.sign(jwtPayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: 60 * 60 * 24 * 7,
      }),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
