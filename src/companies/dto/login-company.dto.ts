import { IsEmail, IsString } from "class-validator";

export class LoginCompanyDto {
    @IsEmail()
    email: string;
    @IsString()
    password: string;
}