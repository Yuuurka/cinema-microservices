import {IsEmail, IsString, Length} from "class-validator";

export class CreateUserRequestDto {
  readonly id: number;
  @IsString({message: "Email должен быть строкой"})
  @IsEmail({}, {message: "Некорректный ввод Email"})
  readonly login: string;
  @Length(7, 255, {message: "Длина пароля должна составлять минимум 7 символов"})
  readonly password: string;
  readonly name?: string;
  readonly fam?: string;
  readonly phone_number?: string;
}