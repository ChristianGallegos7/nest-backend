import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService: JwtService,
    private authService: AuthService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token no encontrado.');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
      console.log('JWT Payload:', payload); // Debugging

      const user = await this.authService.findUserById(payload.id);
      console.log('User:', user); // Debugging
      if (!user) throw new UnauthorizedException('Usuario no encontrado.');

      request['user'] = user;
    } catch (error) {
      console.error('Error en AuthGuard:', error);
      throw new UnauthorizedException('No autorizado.');
    }

    return true;
  }


  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
