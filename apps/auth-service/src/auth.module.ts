import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from "./auth.service";
import { jwttoken } from "./entities/jwttoken.entity";
import { User } from "./entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { SecurityService } from "./security.service";
import { ClientsModule, Transport } from "@nestjs/microservices";

const USER = process.env.RABBITMQ_USER;
const PASSWORD = process.env.RABBITMQ_PASSWORD;
const HOST = process.env.RABBITMQ_HOST;

@Module({
  imports: [TypeOrmModule.forFeature([User, jwttoken]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_URL_AUTH,
      synchronize: true,
      autoLoadEntities: true,
    }),
    ClientsModule.register([
      {
        name: 'RABBITMQ_CONNECTION_PROFILE',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
          queue: 'profile_queue',
          queueOptions: {
            durable: true,
          }}}]),
    ],
  controllers: [AuthController],
  providers: [AuthService, SecurityService, JwtService]
})
export class AuthModule {}