import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { CreateUserRequestDto } from "./dto/create-user-request.dto";
import { User } from "./entities/user.entity";
import { jwttoken } from "./entities/jwttoken.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SecurityService } from "./security.service";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>,
              @InjectRepository(jwttoken) private jwtRepository: Repository<jwttoken>,
              @Inject('RABBITMQ_CONNECTION_PROFILE') private profileProxy: ClientProxy,
              private security: SecurityService) {}

  async login(userDto: CreateUserRequestDto) {
    const user = await this.security.validateUser(userDto)
    return this.security.generateToken(user)
  }

  async register(userDto: CreateUserRequestDto) {
    const candidate = await this.userRepository.findOne({ where: { "login": userDto.login } });

    if (candidate) {
      throw new ConflictException('Аккаунт с таким email уже существует');
    }

    const hashPassword = SecurityService.hash(userDto.password);

    const user = await this.userRepository.save({ login: userDto.login, password: hashPassword });
    const jwt = await this.security.generateToken(user);
    const headers = { authorization: `Bearer ${jwt.result}` };
    const body = {name: userDto.name, fam: userDto.fam, phone_number: userDto.phone_number};
    await this.profileProxy.send({cmd: 'change-profile'}, {requestData: { headers, body: body }}).toPromise()

    return jwt;
  }
}