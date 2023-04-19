import { NestFactory } from "@nestjs/core";
import { ProfileModule } from "./profile.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap(){
  const app = await NestFactory.create(ProfileModule);

  const USER = process.env.RABBITMQ_USER;
  const PASSWORD = process.env.RABBITMQ_PASSWORD;
  const HOST = process.env.RABBITMQ_HOST;
  const QUEUE_PROFILE = process.env.RABBITMQ_PROFILE_QUEUE;

  app.connectMicroservice<MicroserviceOptions>({transport: Transport.RMQ,
    options: {
      urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
      queue: QUEUE_PROFILE,
      noAck: false,
      queueOptions: {
        durable: true
      }
    }});

  await app.startAllMicroservices();
}
bootstrap()