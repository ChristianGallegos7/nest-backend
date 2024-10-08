import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './interfaces/jwt.payload';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async findAll() {
    try {
      const usuarios = await this.userRepository.find();
      return usuarios;
    } catch (error) {
      throw new BadRequestException("No se pudo traer nuevos archivos")
    }
  }

  async create(createAuthDto: CreateAuthDto) {
    try {
      const usuario = this.userRepository.create(createAuthDto);
      usuario.password = await bcrypt.hash(usuario.password, 10);
      await this.userRepository.save(usuario);
      return usuario;
    } catch (error) {
      if (error.code === '23505') {  // Código de error para violación de unicidad en PostgreSQL
        throw new BadRequestException('El email ya está registrado.');
      } else if (error.code === '22001') {  // Código de error para violación de longitud en PostgreSQL
        throw new BadRequestException('Uno de los campos es demasiado largo.');
      } else {
        // Registro del error en los logs para análisis posterior
        console.error('Error al crear usuario:', error);
        throw new InternalServerErrorException('Ocurrió un error inesperado. Por favor, intente de nuevo más tarde.');
      }
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new UnauthorizedException('Credenciales inválidas.');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Credenciales inválidas.');
      }
      const payload = { id: user.id, email: user.email }

      const token = await this.jwtService.signAsync(payload);

      delete user.password;

      return { user, token };
    } catch (error) {
      console.error('Error al autenticar usuario:', error);
      throw new UnauthorizedException('Error al autenticar usuario.');
    }
  }


  async findUserById(id: number): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado.');
      }
      const { password, ...rest } = user;
      return rest as User;
    } catch (error) {
      console.error('Error al encontrar usuario:', error);
      throw new UnauthorizedException('Error al autenticar usuario.');
    }
  }
}

