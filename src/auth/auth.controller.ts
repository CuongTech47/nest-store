import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { AuthDto, loginAuth } from './dto/index';
import { Tokens } from './types';


import { AtGuard, RtGuard } from '../common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from '../common/decorators';
import { GoogleAuthGuard } from "../common/guards/google.guard";

function JwtAuthGuard() {

}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  public jwtToken = {access_token: ''};



  @Public()
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async handleLogin() {
    return {msg : 'Google Auth'}
  }
  @Public()
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async handleRedirect(){
    return {msg : 'ok'}
  }


  @Public()
  @Get('status')
  async user(@Req() request: Request) {
    console.log(request)
    // if (request.user) {
    //   return { msg: 'Authenticated' };
    // } else {
    //   return { msg: 'Not Authenticated' };
    // }

  }

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  async signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return await this.authService.signupLocal(dto);
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  async signinLocal(@Body() dto: loginAuth): Promise<Tokens> {
    return await this.authService.signinLocal(dto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logoutLocal(@GetCurrentUserId() userId: number) {
    return await this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refeshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return await this.authService.refeshTokens(userId, refreshToken);
  }
}
