import { Module } from "@nestjs/common";
import {AppController} from './app.controller';
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule } from "@nestjs/config";
import { JwtService, JwtModule } from "@nestjs/jwt";

const USER = process.env.RABBITMQ_USER;
const PASSWORD = process.env.RABBITMQ_PASSWORD;
const HOST = process.env.RABBITMQ_HOST;
const QUEUE_AUTH = process.env.RABBITMQ_AUTH_QUEUE;
const QUEUE_PROFILE = process.env.RABBITMQ_PROFILE_QUEUE;


@Module({
  imports: [ConfigModule.forRoot({isGlobal: true, envFilePath: './.env'}),
    ClientsModule.register([
      {
        name: 'RABBITMQ_CONNECTION_AUTH',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
          queue: QUEUE_AUTH,
          queueOptions: {
            durable: true,
          }}},
      {
        name: 'RABBITMQ_CONNECTION_PROFILE',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
          queue: QUEUE_PROFILE,
          queueOptions: {
            durable: true,
          }}},
    ])],
  controllers: [AppController],
  providers: [JwtService]
})
export class AppModule {}
