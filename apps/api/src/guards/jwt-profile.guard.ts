import { CanActivate, ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";

/** Проверка авторизован ли пользователь **/
@Injectable()
export class JwtProfileGuard implements CanActivate{
    constructor(private jwtService: JwtService) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        try {
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];

            if (bearer !== 'Bearer' || !token){
                throw new UnauthorizedException({
                    status: HttpStatus.UNAUTHORIZED,
                    result: null,
                    error: `Пользователь не авторизован`
                })
            }
            req.user = this.jwtService.verify(token, {secret: process.env.PRIVATE_JWT_KEY});
            return true
        } catch (e) {
            throw new UnauthorizedException({
                status: HttpStatus.UNAUTHORIZED,
                result: null,
                error: `Пользователь не авторизован`
            })
        }
    }
}