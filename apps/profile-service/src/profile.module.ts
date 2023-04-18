import { Module } from '@nestjs/common';
import { ProfileService } from "./profile.service";
import { Profile } from "./entities/profile.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ProfileController } from "./profile.controller";
import { ConfigModule } from "@nestjs/config";


@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService, JwtModule],
  imports: [ConfigModule.forRoot(), JwtModule.register({
    secret: process.env.PRIVATE_JWT_KEY || 'SECRET78',
    signOptions: {
      expiresIn: '24h'
    }
  }),
    TypeOrmModule.forFeature([Profile]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_URL_PROFILE,
      synchronize: true,
      autoLoadEntities: true,
    })]
})
export class ProfileModule {}