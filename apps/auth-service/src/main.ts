import { NestFactory } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap(){
  const app = await NestFactory.create(AuthModule);

  const USER = process.env.RABBITMQ_USER;
  const PASSWORD = process.env.RABBITMQ_PASSWORD;
  const HOST = process.env.RABBITMQ_HOST;
  const QUEUE_AUTH = process.env.RABBITMQ_AUTH_QUEUE;

  app.connectMicroservice<MicroserviceOptions>({transport: Transport.RMQ,
  options: {
    urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
    queue: QUEUE_AUTH,
    noAck: false,
    queueOptions: {
      durable: true
    }
  }});


  await app.startAllMicroservices();
}
bootstrap()