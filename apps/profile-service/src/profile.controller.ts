import {Controller} from '@nestjs/common';
import {ProfileService} from "./profile.service";
import { ApiTags } from "@nestjs/swagger";
import { Ctx, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";


@Controller()
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {
    }

    @ApiTags('Посмотреть настройки профиля')
    @MessagePattern({cmd: 'read-profile'})
    async getInfoUser(@Ctx() context: RmqContext, @Payload() requestData){
        const channel = context.getChannelRef();
        const message = context.getMessage();
        channel.ack(message);
        return this.profileService.getInfoUser(requestData);
    }

    @ApiTags('Изменить настройки профиля')
    @MessagePattern({cmd: 'change-profile'})
    async changeInfoUser(@Ctx() context: RmqContext, @Payload() requestData){
        const channel = context.getChannelRef();
        const message = context.getMessage();
        channel.ack(message);

        return this.profileService.changeInfoUser(requestData);
    }
}
