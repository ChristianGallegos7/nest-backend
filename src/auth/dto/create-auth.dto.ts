import { IsEmail, IsString, Matches, MinLength } from "class-validator";
import { Transform } from "class-transformer";

export class CreateAuthDto {
    @IsString()
    @MinLength(6, {
        message: 'El nombre debe tener al menos 6 caracteres'
    })
    nombre: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6, {
        message: 'La contraseña debe tener al menos 6 caracteres'
    })
    password: string;

    @IsString()
    provincia: string;

    @IsString()
    @Matches(/^0\d{9}$/, { message: 'El teléfono debe tener 10 dígitos y comenzar con 0' })
    telefono: string;
}
