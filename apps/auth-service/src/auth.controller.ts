import {Controller} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import { Ctx, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";
import { AuthService } from "./auth.service";
import { CreateUserRequestDto } from "./dto/create-user-request.dto";


@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @ApiTags('Войти в систему')
    @MessagePattern({cmd: 'login-user'})
    async login(@Ctx() context: RmqContext, @Payload() entryUser: CreateUserRequestDto){
        const channel = context.getChannelRef();
        const message = context.getMessage();
        channel.ack(message);

        return this.authService.login(entryUser);
    }

    @ApiTags('Регистрация')
    @MessagePattern({cmd: 'register-user'})
    async register(@Ctx() context: RmqContext, @Payload() newUser: CreateUserRequestDto){
        const channel = context.getChannelRef();
        const message = context.getMessage();
        channel.ack(message);

        return this.authService.register(newUser)
    }
}
