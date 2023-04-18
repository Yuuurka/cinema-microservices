import { Body, Controller, Get, Inject, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import {JwtProfileGuard} from "./guards/jwt-profile.guard";

@Controller()
export class AppController{
  constructor(@Inject('RABBITMQ_CONNECTION_PROFILE') private profileProxy: ClientProxy,
              @Inject('RABBITMQ_CONNECTION_AUTH') private authProxy: ClientProxy,) {
  }

  @Post('/login')
  async loginUser(
    @Body('login') login: string,
    @Body('password') password: string){
    return this.authProxy.send({cmd: 'login-user'}, {login, password})
  }

  @Post('/registration')
  async registerUser(
    @Body('login') login: string,
    @Body('password') password: string,
    @Body('name') name: string,
    @Body('fam') fam: string,
    @Body('phone_number') phone_number: string){
    return this.authProxy.send({
      cmd: 'register-user'
    }, {login, password, name, fam, phone_number})
  }

  @UseGuards(JwtProfileGuard)
  @Get('/settings')
  async getInfoUser(@Req() req: Request){
    const requestData = {
      url: req.url,
      method: req.method,
      headers: req.headers,
      body: req.body,
    }
    return this.profileProxy.send({cmd: 'read-profile'},{requestData});
  }

  @UseGuards(JwtProfileGuard)
  @Put('/settings')
  async changeInfoUser(@Req() req: Request) {
    const requestData = {
      url: req.url,
      method: req.method,
      headers: req.headers,
      body: req.body,
    }
    return this.profileProxy.send({
      cmd: 'change-profile'
    },{requestData});
  }
}