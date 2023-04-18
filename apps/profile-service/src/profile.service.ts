import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile } from "./entities/profile.entity";
import { Repository } from "typeorm";

@Injectable()
export class ProfileService {
  constructor(@InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private jwtService: JwtService) {
  }

  async getInfoUser(requestData): Promise<Object> {
    const id = this.getId(requestData);

    return {
      status: HttpStatus.OK,
      result: await this.profileRepository.findOne({ where: { id: id } }),
      error: null
    }
  }

  async changeInfoUser(requestData): Promise<Object> {
    const id = this.getId(requestData);
    const body = requestData.requestData.body;
    body['id'] = id;
    await this.profileRepository.save(body);

    return {
      status: HttpStatus.OK,
      result: await this.profileRepository.findOne({ where: { id: id } }),
      error: null
    }
  }

  private getId(req): number {
    const authorization : string = req.requestData.headers.authorization;
    const token = authorization.split(' ')[1];

    return this.jwtService.verify(token)['id']
  }
}
