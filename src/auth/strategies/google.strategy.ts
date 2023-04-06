import { PassportStrategy } from '@nestjs/passport';
import { Strategy ,Profile } from 'passport-google-oauth20';
// import { Profile } from "passport";
import { Inject, Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";



@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('AUTH_SERVICE')private readonly authService : AuthService) {
    super({
      clientID : '821244937684-vs87ioj16vlvr2uq8k3dc0794bp14gn7.apps.googleusercontent.com',
      clientSecret :'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',
      callbackURL:'http://localhost:3000/api/auth/google/redirect',
      scope :['profile','email'],

    });
  }
  async validate(accessToken : string, refreshToken : string , profile : Profile){

    const customer = await this.authService.validateCustomer({
      email : profile.emails[0].value,
      name : profile.displayName,
      imgUrl : profile.photos[0].value,
    })
    return customer || null
  }
}
