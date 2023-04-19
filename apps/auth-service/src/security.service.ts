import { HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserRequestDto } from "./dto/create-user-request.dto";
import * as crypto from "crypto";
import { InjectRepository } from "@nestjs/typeorm";
import { jwttoken } from "./entities/jwttoken.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { User } from "./entities/user.entity";

@Injectable()
export class SecurityService{
  constructor(@InjectRepository(User) private userRepository: Repository<User>,
              @InjectRepository(jwttoken) private jwtRepository: Repository<jwttoken>,
              private jwtService: JwtService) {
  }

  async generateToken(user: CreateUserRequestDto) {
    const payload = {id: user.id, login: user.login, password: user.password};
    const jwt = this.jwtService.sign(payload, {secret: process.env.PRIVATE_JWT_KEY});
    await this.jwtRepository.save({user_id: user.id, token: jwt});
    return {
      status: HttpStatus.OK,
      result: jwt,
      error: null
    }
  }

  async validateUser(userDto: CreateUserRequestDto) {
    const user = await this.userRepository.findOne({where: {login: userDto.login}});
    if (!user) {
      throw new UnauthorizedException({
        status: HttpStatus.BAD_REQUEST,
        result: null,
        error: 'Неверный логин или пароль'
      })
    }
    const passwordEquals = SecurityService.compare(userDto.password, user.password);
    if (passwordEquals) {
      return user;
    }else{
      throw new UnauthorizedException({
        status: HttpStatus.BAD_REQUEST,
        result: null,
        error: 'Неверный логин или пароль'
      })
    }
  }

  static hash(value: string) : string {
    const algorithm = 'aes-256-cbc';
    const key = "theremustbe32symbolsofkeyvalueee";
    const iv = 'vectorvector1234';

    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), Buffer.from(iv));
    let crypted = cipher.update(value, 'utf-8', 'hex');
    crypted += cipher.final('hex');

    return crypted;
  }

  static compare(value:string, valueHashed:string) : boolean {
    const toHash = this.hash(value);

    return (toHash === valueHashed);
  }
}