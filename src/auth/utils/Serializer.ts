import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Inject, Injectable } from "@nestjs/common";


@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(@Inject('AUTH_SERVICE')private readonly authService : AuthService) {
    super();
  }
  serializeUser(customer: any, done: Function): any {
    console.log('Serializer Customer')
    done(null , customer)
  }
  async deserializeUser(payload: any, done: Function){
    const customer = await this.authService.findCustomer(payload.customerId)
    console.log('Deserializer Customer')
    console.log(customer)
    return customer ? done(null, customer) : done(null , null)
  }
}